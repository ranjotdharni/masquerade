from backend.helpers import GenericError
from jsonschema import validate
from jsonschema.exceptions import ValidationError

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
                    "id": "string",
                    "type": "number",
                    "optional": "boolean",
                    "question": "string",
                    "answers": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": "string",
                                "answer": "string"
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
    except ValidationError as e:
        print(e)
        return GenericError(message="Malformed Data").to_dict()