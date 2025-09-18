from backend.helpers import GenericError
from jsonschema import validate

from django.conf import settings

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

        if len(slug["name"].strip()) < 1 or len(slug["name"].strip()) > 128:
            return GenericError(message="Please provide a survey name (max length: 128).").to_dict()
        
        if len(slug["questions"]) == 0 or len(slug["questions"]) > settings.MAX_QUESTIONS_PER_SURVEY:
            return GenericError(message="Survey must include 1 to 10 questions.").to_dict()
        
        for question in slug["questions"]:
            if len(question["question"].strip()) < 1 or len(question["question"].strip()) > 256:
                return GenericError(message="All questions' text must have a value (max length: 256).").to_dict()
            
            if question["type"] not in settings.QUESTION_TYPE_IDS:
                return GenericError(message="An unrecognized question type was detected.").to_dict()
            
            if question["type"] != settings.RATING_ID and ("answers" not in question or len(question["answers"]) == 0 or len(question["answers"]) > settings.MAX_ANSWERS_PER_QUESTION or any(len(a["answer"].strip()) < 1 or len(a["answer"].strip()) > 256 for a in question["answers"])):
                return GenericError(message="Non-rating type questions must include 1 to 4 answers each with a max length of 256 characters.").to_dict()
        
        return { "success": True, "message": "Survey parameters are valid." }
    except Exception as e:
        print(e)
        return GenericError(message="Malformed data was detected.").to_dict()
