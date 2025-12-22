'''
Helper functions for working with inter-related data coming 
from both the user and MongoDB ("interpreting" between client and database).
'''

from bson.objectid import ObjectId
from backend.helpers import GenericError

'''
SINGLE_CHOICE_ID = 1
MULTIPLE_CHOICE_ID = 2
RANKING_ID = 3
RATING_ID = 4
'''

from django.conf import settings

def validate_answer_submission_single(question, answer) -> dict[str, bool] | GenericError:
    success = { "success": True, "answered": False }

    # Check incorrect type or question/answer id mismatch
    if question["type"] != settings.SINGLE_CHOICE_ID or answer["type"] != settings.SINGLE_CHOICE_ID or question["_id"]["$oid"] != answer["_id"]["$oid"]:
        return GenericError("Could not validate survey (malformed or misordered submission).")
    
    optional = question["optional"]
    slug = answer["slug"] # When everything goes as planned, this is just the id of the user's selected answer

    # Valid if any possible answer matches user's selected answer
    for a in question["answers"]:
        if a["_id"]["$oid"] == slug:
            success["answered"] = True  # Update 'answered' field in success object
            return success
    
    # Valid user selection not found, return success only if question is optional
    if optional:
        return success
    
    return GenericError("Required question not answered.")

def generate_answer_object_single(survey_id, answer):
    sid = ObjectId(survey_id)
    qid = ObjectId(answer["_id"]["$oid"])
    aid = ObjectId(answer["slug"])
    return [{
        "filters": {
            "_id": sid,
            "questions._id": qid,
            "questions.answers._id": aid
        },
        "increments": {
            "$inc": {
                "questions.$[q].submissions": 1,
                "questions.$[q].answers.$[a].submissions": 1
            }
        },
        "array_filters": [
            {"q._id": qid},
            {"a._id": aid}
        ]
    }]

def validate_answer_submission_multi(question, answer) -> dict[str, bool] | GenericError:
    success = { "success": True, "answered": True }

    # Check incorrect type or question/answer id mismatch
    if question["type"] != settings.MULTIPLE_CHOICE_ID or answer["type"] != settings.MULTIPLE_CHOICE_ID or question["_id"]["$oid"] != answer["_id"]["$oid"]:
        return GenericError("Could not validate survey (malformed or misordered submission).")
    
    optional = question["optional"]
    slug = answer["slug"] # When everything goes as planned, this is the id of all the user's selected answers
    all_answers = [a["_id"]["$oid"] for a in question["answers"]]

    # Valid if all user's selected answers exist in possible answers
    for a in slug:
        if a not in all_answers:
            if optional:
                success["answered"] = False  # not answered, update 'answered' field and return success object if question is optional
                return success
            return GenericError("Required question not answered.")
    
    return success

def generate_answer_object_multi(survey_id, answer):
    sid = ObjectId(survey_id)
    qid = ObjectId(answer["_id"]["$oid"])
    aids = answer["slug"]
    payload = []

    for aid in aids:
        oaid = ObjectId(aid)
        payload.append({
            "filters": {
                "_id": sid,
                "questions._id": qid,
                "questions.answers._id": oaid
            },
            "increments": {
                "$inc": {
                    "questions.$[q].submissions": 1,
                    "questions.$[q].answers.$[a].submissions": 1
                }
            },
            "array_filters": [
                {"q._id": qid},
                {"a._id": oaid}
            ]
        })

    return payload

def validate_answer_submission_rank(question, answer) -> dict[str, bool] | GenericError:
    success = { "success": True, "answered": False }

    # Check incorrect type or question/answer id mismatch
    if question["type"] != settings.RANKING_ID or answer["type"] != settings.RANKING_ID or question["_id"]["$oid"] != answer["_id"]["$oid"]:
        return GenericError("Could not validate survey (malformed or misordered submission).")
    
    optional = question["optional"]
    slug = answer["slug"] # When everything goes as planned, this is the id and rankings of all the user's selected answers
    current_length = len(slug)

    if current_length == 0:
        if optional:
            return success
        return GenericError("Required question not answered.")
    
    all_answers = [a["_id"]["$oid"] for a in question["answers"]]
    total_sum = 0

    # Sum all possible ranks (so if there are 3 possible ranks, then the sum is 3 + 2 + 1 = 6)
    # Then, subtract each user submitted answer's rank from the sum as each answer is validated one by one.
    # This is all done below (Also, see next comment)

    while current_length != 0:
        total_sum += current_length
        current_length -= 1
    
    for a in slug:
        if a["_id"]["$oid"] not in all_answers:
            if optional:
                return success
            return GenericError("Required question not answered.")
        total_sum -= a["rank"]
    
    # If all possible ranks have been assigned properly, then sum should now be 0. Otherwise, something went wrong.
    if total_sum != 0:
        if optional:
            return success
        return GenericError("Required answer(s) were missing/malformed.")

    success["answered"] = True
    return success

def generate_answer_object_rank(survey_id, answer):
    sid = ObjectId(survey_id)
    qid = ObjectId(answer["_id"]["$oid"])
    aids = answer["slug"]
    payload = []

    for aid in aids:
        oaid = ObjectId(aid["_id"]["$oid"])
        payload.append({
            "filters": {
                "_id": sid,
                "questions._id": qid,
                "questions.answers._id": oaid
            },
            "increments": {
                "$inc": {
                    "questions.$[q].submissions": 1,
                    f"questions.$[q].answers.$[a].{aid["rank"]}": 1
                }
            },
            "array_filters": [
                {"q._id": qid},
                {"a._id": oaid}
            ]
        })

    return payload

def validate_answer_submission_rate(question, answer) -> dict[str, bool] | GenericError:
    success = { "success": True, "answered": True }

    # Check incorrect type or question/answer id mismatch
    if question["type"] != settings.RATING_ID or answer["type"] != settings.RATING_ID or question["_id"]["$oid"] != answer["_id"]["$oid"]:
        return GenericError("Could not validate survey (malformed or misordered submission).")
    
    optional = question["optional"]
    slug = answer["slug"] # When everything goes as planned, this is the user's selected rating

    # Valid if user's choice is in range 1 - 5 (inclusive)
    if slug > 0 and slug < 6:
        return success
    
    # Valid user selection not found, return success only if question is optional
    if optional:
        success["answered"] = False
        return success
    
    return GenericError("Required question not answered.")

def generate_answer_object_rate(survey_id, answer):
    sid = ObjectId(survey_id)
    qid = ObjectId(answer["_id"]["$oid"])
    return [{
        "filters": {
            "_id": sid,
            "questions._id": qid,
        },
        "increments": {
            "$inc": {
                "questions.$.submissions": 1,
                f"questions.$.answers.{answer["slug"]}": 1
            }
        },
        "array_filters": []
    }]
