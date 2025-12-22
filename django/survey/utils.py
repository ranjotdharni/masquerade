from backend.helpers import GenericError
from jsonschema import validate

from django.conf import settings

from bson.objectid import ObjectId
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

from interpreters import (
    validate_answer_submission_single, 
    validate_answer_submission_multi, 
    validate_answer_submission_rank, 
    validate_answer_submission_rate,

    generate_answer_object_single, 
    generate_answer_object_multi, 
    generate_answer_object_rank, 
    generate_answer_object_rate,
)


User = get_user_model()

survey_creation_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "inviteOnly": {"type": "boolean"},
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "type": {"type": "number"},
                    "optional": {"type": "boolean"},
                    "question": {"type": "string"},
                    "answers": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "answer": {"type": "string"}
                            },
                            "required": []
                        }
                    }
                },
                "required": ["type", "optional", "question"]
            }
        }
    },
    "required": ["name", "inviteOnly", "questions"]
}


def validate_survey_creation_slug(slug):
    try:
        validate(instance=slug, schema=survey_creation_schema)

        if len(slug["name"].strip()) < 1 or len(slug["name"].strip()) > 50:
            return GenericError(message="Please provide a survey name (max length: 50).").to_dict()
        
        if len(slug["questions"]) == 0 or len(slug["questions"]) > settings.MAX_QUESTIONS_PER_SURVEY:
            return GenericError(message="Survey must include 1 to 10 questions.").to_dict()
        
        for question in slug["questions"]:
            if len(question["question"].strip()) < 1 or len(question["question"].strip()) > 200:
                return GenericError(message="All questions' text must have a value (max length: 200).").to_dict()
            
            if question["type"] not in settings.QUESTION_TYPE_IDS:
                return GenericError(message="An unrecognized question type was detected.").to_dict()
            
            if question["type"] != settings.RATING_ID and ("answers" not in question or len(question["answers"]) == 0 or len(question["answers"]) > settings.MAX_ANSWERS_PER_QUESTION or any(len(a["answer"].strip()) < 1 or len(a["answer"].strip()) > 150 for a in question["answers"])):
                return GenericError(message="Non-rating type questions must include 1 to 4 answers each with a max length of 150 characters.").to_dict()
        
        return { "success": True, "message": "Survey parameters are valid." }
    except Exception as e:
        print(e)
        return GenericError(message="Malformed data was detected.").to_dict()


def create_mongo_survey_object(auth, slug):
    try:
        raw_access_token = auth.split()[1]
        access = AccessToken(raw_access_token)

        creator = User.objects.get(id=access.payload.get("user_id"))

        mongo_object = {
            "creator": creator.username,
            "name": slug["name"],
            "inviteOnly": slug["inviteOnly"],
            "submissions": 0,
        }

        if slug["inviteOnly"]:
            mongo_object["inviteList"] = []

        questions = []

        for question in slug["questions"]:
            q = {
                "_id": ObjectId(),
                "type": question["type"],
                "optional": question["optional"],
                "submissions": 0,
                "question": question["question"],
            }

            answers = None

            if question["type"] == settings.RATING_ID:
                answers = {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                }
            else:
                answers = []

                for a in question["answers"]:
                    if a["answer"].strip() != "":
                        temp = {
                            "_id": ObjectId(),
                            "answer": a["answer"].strip(),
                        }

                        if question["type"] == settings.RANKING_ID:
                            temp["1"] = 0
                            temp["2"] = 0
                            temp["3"] = 0
                            temp["4"] = 0
                        else:
                            temp["submissions"] = 0
                        
                        answers.append(temp)
                
                if len(answers) == 0:
                    raise Exception("Question(s) requiring answers found missing answers.")
                
            q["answers"] = answers
            questions.append(q)

        if len(questions) < 1 or len(questions) > settings.MAX_QUESTIONS_PER_SURVEY:
            raise Exception("Invalid number of questions provided (1 through 10 required).")

        mongo_object["questions"] = questions
        return mongo_object
    except Exception as e:
        print(e)
        return GenericError(message=str(e).strip() or "Malformed data was detected.").to_dict()


def create_mongo_answer_object(question, answer):
    success = {
        "success": True,
        "payload": []
    }

    try: 
        validation = { "success": False, "empty": True }

        match answer["type"]:
            case settings.SINGLE_CHOICE_ID:
                validation = validate_answer_submission_single(question, answer)
                if "success" in validation and validation["answered"]:
                    success["payload"] = generate_answer_object_single(question["_id"]["$oid"], answer)
            case settings.MULTIPLE_CHOICE_ID:
                validation = validate_answer_submission_multi(question, answer)
                if "success" in validation and validation["answered"]:
                    success["payload"] = generate_answer_object_multi(question["_id"]["$oid"], answer)
            case settings.RANKING_ID:
                validation = validate_answer_submission_rank(question, answer)
                if "success" in validation and validation["answered"]:
                    success["payload"] = generate_answer_object_rank(question["_id"]["$oid"], answer)
            case settings.RATING_ID:
                validation = validate_answer_submission_rate(question, answer)
                if "success" in validation and validation["answered"]:
                    success["payload"] = generate_answer_object_rate(question["_id"]["$oid"], answer)
            case _:
                return GenericError("Could not validate survey (server failed to classify submission data).")
            
        if "error" in validation:
            return validation
    except Exception as e:
        print(e)
        return GenericError("Could not validate survey (server failed to read submission data).")
        
    return success
