import json

# Create your views here.

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .utils import validate_survey_creation_slug

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
                # Create Survey

                response = Response({ "success": True, "message": "New Survey Created" }, status.HTTP_200_OK)
            else:
                response = Response({ "error": True, "message": valid["message"] }, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            response = Response({ "error": "true", "message": "500 Internal Server Error" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response
