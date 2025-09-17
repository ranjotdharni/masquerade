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

            print(data)

            validate_survey_creation_slug(data)

            response = Response({ "success": "true", "message": "New Survey Created" }, status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = Response({ "error": "true", "message": "500 ISE" }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response
