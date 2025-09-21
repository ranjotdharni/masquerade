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

from .utils import validate_survey_creation_slug, create_mongo_survey_object

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
            response = Response({ "error": "true", "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response
    
@method_decorator(csrf_protect, name="dispatch")
class RetrieveSurvey(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = None

        try:
            surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
            result = surveysCollection.find({})

            survey_list = list(result)
            content = json.loads(dumps(survey_list))

            response = Response({ "success": True, "content": content }, status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = Response({ "error": "true", "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response
