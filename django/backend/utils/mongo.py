from django.conf import settings
from bson import ObjectId
from ..helpers import GenericError

def get_survey_metadata(id: str, format=settings.PUBLIC_SURVEY_DATA_FORMAT):
    oid = ObjectId(id)

    try:
        surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
        survey = surveysCollection.find_one({"_id": oid}, format)

        if not survey:
            return GenericError("Survey not found.")
        
        return survey
    except Exception as e:
        print(e)
        return GenericError(str(e) or "Failed to retrieve survey data (500 ISE)")

def get_survey_metadata_bulk(ids: list[str], format=settings.PUBLIC_SURVEY_DATA_FORMAT):
    try:
        surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
        surveys = surveysCollection.find(
            { "_id": { "$in": [ObjectId(id) for id in ids] } },
            format
        )

        return { str(survey["_id"]["$oid"]): survey for survey in surveys }
    except Exception as e:
        print(e)
        return GenericError(str(e) or "Failed to retrieve survey data (500 ISE)")
