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

    # Check inccorrect type or question/answer id mismatch
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
    qid = ObjectId(answer["_id"]["$oid"])
    aid = ObjectId(answer["slug"])
    return {
        "filters": {
            "_id": ObjectId(survey_id),
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
    }
