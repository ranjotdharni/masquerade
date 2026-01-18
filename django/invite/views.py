import json

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@method_decorator(csrf_protect, name="dispatch")
class Invites(APIView):
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
    
    def delete(self, request):
        placeholder = "add code here"
