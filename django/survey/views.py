import json

# Create your views here.

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bson.json_util import dumps
from bson.objectid import ObjectId
from bson.errors import InvalidId

from pymongo import UpdateOne

from .utils import validate_survey_creation_slug, create_mongo_survey_object, create_mongo_answer_object
from apiauth.utils import extract_user_from_request

PUBLIC_SURVEY_DATA_FORMAT = {
    "submissions": 0,
    "inviteList": 0,
    "creator": 0,
    "questions.submissions": 0,
    "questions.answers.submissions": 0,
    "questions.answers.1": 0,
    "questions.answers.2": 0,
    "questions.answers.3": 0,
    "questions.answers.4": 0,
    "questions.answers.5": 0,
}

PRIVATE_SURVEY_DATA_FORMAT = {
    "inviteList": 0,
}

@method_decorator(csrf_protect, name="dispatch")
class CreateSurvey(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = None

        try:
            raw = request.body
            data = json.loads(raw)

            valid = validate_survey_creation_slug(data)

            if "success" in valid:
                mongo_object = create_mongo_survey_object(request.headers.get("Authorization"), data)
                
                surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
                surveysCollection.insert_one(mongo_object)

                response = Response({ "success": True, "message": "New Survey Created" }, status.HTTP_200_OK)
            else:
                response = Response({ "error": True, "message": valid["message"] }, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            response = Response({ "error": True, "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response

@method_decorator(csrf_protect, name="dispatch")
class SurveyCatalog(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = Response({ "error": True, "message": "Invalid Survey ID" }, status.HTTP_400_BAD_REQUEST)

        try:
            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            requestHasParams = "id" in request.GET
            result = None

            if (requestHasParams):
                id = request.GET["id"]

                oid = ObjectId(id)

                result = surveysCollection.find({"_id": oid}, PUBLIC_SURVEY_DATA_FORMAT)
            else:
                result = surveysCollection.find({}, PUBLIC_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
        except (InvalidId, TypeError):
            return response
        except Exception as e:
            print(e)
            response = Response({ "error": True, "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response
    
    def post(self, request):
        empty_response = Response({"empty": True}, status.HTTP_404_NOT_FOUND)
        response = None

        try:
            raw = request.body
            data = json.loads(raw)

            if "id" not in data:
                return Response({"error": True, "message": "Malformed Data"}, status.HTTP_400_BAD_REQUEST)

            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            result = surveysCollection.find({"_id": ObjectId(data["id"])}, PUBLIC_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            if len(content) == 0:
                return empty_response

            response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
        except InvalidId as e:
            response = empty_response
        except Exception as e:
            print(e)
            response = Response({ "error": True, "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response

@method_decorator(csrf_protect, name="dispatch")
class SurveyDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = Response({ "error": True, "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            requestHasParams = "id" in request.GET
            result = None

            user = extract_user_from_request(request)

            if isinstance(user, dict) and user["error"]:
                return Response({"error": True, "message": user["message"]}, status.HTTP_400_BAD_REQUEST)

            if (requestHasParams):
                id = request.GET["id"]

                oid = ObjectId(id)

                result = surveysCollection.find({"_id": oid}, PRIVATE_SURVEY_DATA_FORMAT)
            else:
                result = surveysCollection.find({"creator": user.username}, PRIVATE_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            if len(content) != 0:
                for survey in content:
                    if survey["creator"] != user.username:
                        return Response({"error": True, "message": "You don't have permission to see details of this survey(s)."}, status.HTTP_400_BAD_REQUEST)

            response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
        except (InvalidId, TypeError) as e:
            print(e)
            response = Response({"error": True, "message": "Invalid Survey ID"}, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)

        return response

@method_decorator(csrf_protect, name="dispatch")
class SubmitSurvey(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        success = Response({ "success": True, "message": "Survey Submitted!" }, status.HTTP_200_OK)
        failure = Response({ "error": True, "message": "Could not validate survey. Check submission or try again later." }, status.HTTP_409_CONFLICT)

        try:
            raw = request.body
            data = json.loads(raw)

            if "id" not in data or "answers" not in data:
                return Response({ "error": True, "message": "Cannot find survey/submission (missing parameters)." }, status.HTTP_400_BAD_REQUEST)

            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            result = surveysCollection.find({"_id": ObjectId(data["id"])}, PUBLIC_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            search_results = json.loads(dumps(survey_list))

            if len(search_results) == 0 or len(data["answers"]) == 0:
                return Response({ "error": True, "message": "Could not find survey." }, status.HTTP_404_NOT_FOUND)
            
            # Check if invite only survey   

            survey = search_results[0]
            submission = data["answers"]

            if len(survey["questions"]) != len(submission):
                return failure
            
            updates = []

            for question, answer in zip(survey["questions"], submission):
                mongo_answer_object = create_mongo_answer_object(question, answer)

                if "error" in mongo_answer_object:
                    return Response(mongo_answer_object, status.HTTP_409_CONFLICT)
                
                if "success" in mongo_answer_object:
                    for update in mongo_answer_object["payload"]:
                        updates.append(UpdateOne(update["filters"], update["increments"], array_filters=update["array_filters"]))
                else:
                    return failure
            
            if len(updates) == 0:
                return failure
            
            updates.append(UpdateOne({"_id": survey["_id"]}, {"$inc": {"submissions": 1}}))
            result = surveysCollection.bulk_write(updates, ordered=False) # If no exception is raised, this succeeded and survey submission is complete
        except Exception as e:
            print(e)
            return Response({"error": True, "message": "500 Internal Server Error"}, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return success
