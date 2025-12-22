'''
Helper functions for working with inter-related data coming 
from both the user and MongoDB ("interpreting" between client and database).
'''

from backend.helpers import GenericError

'''
SINGLE_CHOICE_ID = 1
MULTIPLE_CHOICE_ID = 2
RANKING_ID = 3
RATING_ID = 4
'''

from django.conf import settings

def validate_answer_single(question, answer) -> dict[str, bool] | GenericError:
    success = { "success": True, "answered": False }

    if question["type"] != settings.SINGLE_CHOICE_ID or answer["type"] != settings.SINGLE_CHOICE_ID or question["_id"]["$oid"] != answer["_id"]["$oid"]:
        return GenericError("Could not validate survey (malformed or misordered submission).")
    
    optional = question["optional"]
    slug = answer["slug"]

    for a in question["answers"]:
        if a["_id"]["$oid"] == slug:
            success["answered"] = True
            return success
    
    if optional:
        return success
    
    return GenericError("Required question not answered.")
