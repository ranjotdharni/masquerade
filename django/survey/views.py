import json

# Create your views here.

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.conf import settings

from backend.helpers import GenericError
from invite.models import Invite
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bson.json_util import dumps, loads
from bson.objectid import ObjectId
from bson.errors import InvalidId

from pymongo import UpdateOne

from .utils import validate_survey_creation_slug, create_mongo_survey_object, create_mongo_answer_object
from apiauth.utils import extract_user_from_request

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
class DeleteSurvey(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        response = Response({ "error": True, "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            data = request.data
            requestHasDetails = "id" in data
            result = None

            user = extract_user_from_request(request)

            if isinstance(user, dict) and user["error"]:
                return Response({"error": True, "message": user["message"] or "Cannot identify you. Please log in."}, status.HTTP_401_UNAUTHORIZED)
            
            if (requestHasDetails):
                id = data["id"]
                oid = ObjectId(id)

                creatorOnlyFilter = {
                    "_id": 0,
                    "name": 0,
                    "inviteOnly": 0,
                    "submissions": 0,
                    "questions": 0,
                }

                result = surveysCollection.find({"_id": oid, "creator": user.username}, creatorOnlyFilter)
            else:
                return Response({"error": True, "message": "No Survey ID detected or improperly passed."}, status.HTTP_400_BAD_REQUEST)

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            if len(content) != 0:
                for survey in content:
                    if survey["creator"] != user.username:
                        return Response({"error": True, "message": "Permission Error"}, status.HTTP_400_BAD_REQUEST)
                    
                result = surveysCollection.delete_one({ "_id": ObjectId(data["id"]) })

                if result.acknowledged and result.deleted_count > 0:
                    response = Response({ "success": True, "message": "Survey Deleted." }, status.HTTP_200_OK)
            else:
                response = Response({ "error": True, "message": "No valid survey found." }, status.HTTP_200_OK)
        except (InvalidId, TypeError) as e:
            print(e)
            response = Response({"error": True, "message": "Malformed request detected."}, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)

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
            surveys = None
            content = None

            if requestHasParams:
                id = request.GET["id"]
                oid = ObjectId(id)

                result = surveysCollection.find({"_id": oid}, settings.PUBLIC_SURVEY_DATA_FORMAT)
            else:
                result = surveysCollection.find({}, settings.PUBLIC_SURVEY_DATA_FORMAT)

            surveys = list(result)
            content = json.loads(dumps(surveys))

            for survey in content:
                survey["numberOfQuestions"] = len(survey["questions"])
                survey["questions"] = None

            response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
        except (InvalidId, TypeError) as e:
            print(e)
            return response

        return response
    
    def post(self, request):
        empty_response = Response({"empty": True}, status.HTTP_404_NOT_FOUND)
        response = None

        try:
            raw = request.body
            data = json.loads(raw)

            if "id" not in data:
                return Response({"error": True, "message": "Malformed Data"}, status.HTTP_400_BAD_REQUEST)

            surveyId = data["id"]
            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            result = surveysCollection.find({"_id": ObjectId(surveyId)}, settings.PUBLIC_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            if len(content) == 0:
                return empty_response

            survey = content[0]
            surveyRequiresInvite = survey["inviteOnly"]

            # Check if user has an invite 
            if surveyRequiresInvite:
                user = extract_user_from_request(request)

                if isinstance(user, dict) and user["error"]:
                    return Response(GenericError(user["message"] or "Cannot identify you. Please log in."), status.HTTP_401_UNAUTHORIZED)
                
                userDoesNotHaveInvite = not Invite.objects.filter(survey=surveyId, recipient=user.username).exists()

                if userDoesNotHaveInvite:
                    return Response(GenericError("Missing invitation."), status.HTTP_400_BAD_REQUEST)

            response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
        except (TypeError, InvalidId) as e:
            print(e)
            response = empty_response

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
                return Response({"error": True, "message": user["message"] or "Cannot identify you. Please log in."}, status.HTTP_401_UNAUTHORIZED)
            
            if (requestHasParams):
                id = request.GET["id"]

                oid = ObjectId(id)

                result = surveysCollection.find({"_id": oid, "creator": user.username}, settings.PRIVATE_SURVEY_DATA_FORMAT)
            else:
                result = surveysCollection.find({"creator": user.username}, settings.PRIVATE_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            if len(content) != 0:
                for survey in content:
                    if survey["creator"] != user.username:
                        return Response({"error": True, "message": "You don't have permission to see details of this survey(s)."}, status.HTTP_400_BAD_REQUEST)
                    
                response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
            else:
                response = Response({ "error": True, "message": "No viewable survey found." }, status.HTTP_200_OK)
        except (InvalidId, TypeError) as e:
            print(e)
            response = Response({"error": True, "message": "Malformed request detected."}, status.HTTP_400_BAD_REQUEST)
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

            surveyId = data["id"]
            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            result = surveysCollection.find({"_id": ObjectId(surveyId)}, settings.PUBLIC_SURVEY_DATA_FORMAT)

            survey_list = list(result)
            search_results = json.loads(dumps(survey_list))

            if len(search_results) == 0 or len(data["answers"]) == 0:
                return Response({ "error": True, "message": "Could not find survey." }, status.HTTP_404_NOT_FOUND)

            survey = search_results[0]
            surveyRequiresInvite = survey["inviteOnly"]

            # Check if user has an invite 
            if surveyRequiresInvite:
                user = extract_user_from_request(request)

                if isinstance(user, dict) and user["error"]:
                    return Response(GenericError(user["message"] or "Cannot identify you. Please log in."), status.HTTP_401_UNAUTHORIZED)
                
                userDoesNotHaveInvite = not Invite.objects.filter(survey=surveyId, recipient=user.username).exists()

                if userDoesNotHaveInvite:
                    return Response(GenericError("Missing invitation."), status.HTTP_400_BAD_REQUEST)

            submission = data["answers"]

            if len(survey["questions"]) != len(submission):
                return failure
            
            updates = []

            for question, answer in zip(survey["questions"], submission):
                mongo_answer_object = create_mongo_answer_object(survey["_id"]["$oid"], question, answer)

                if "error" in mongo_answer_object:
                    return Response(mongo_answer_object, status.HTTP_409_CONFLICT)  # Required question not answered properly (or missing)
                
                if "empty" in mongo_answer_object:  # Question wasn't answered but was optional
                    continue
                
                if "success" in mongo_answer_object:
                    modificationDetails = mongo_answer_object["payload"]
                    updates.append(UpdateOne(
                        **modificationDetails
                    ))
                else:
                    return failure
                
            if len(updates) == 0:
                return failure
            
            updates.append(UpdateOne({"_id": ObjectId(survey["_id"]["$oid"])}, {"$inc": {"submissions": 1}})) # increment submission count for survey at top level of document

            result = surveysCollection.bulk_write(updates, ordered=False)

            # delete any existing invite upon submission
            if surveyRequiresInvite:
                toBeDeletedInvite = Invite.objects.get(survey=surveyId, recipient=user.username)
                toBeDeletedInvite.delete()
        except (InvalidId, TypeError, Invite.DoesNotExist) as e:
            print(e)
            return Response({"error": True, "message": "Improper request detected (invalid survey id or missing invite or unknown format issue)."}, status.HTTP_400_BAD_REQUEST)
        
        return success
