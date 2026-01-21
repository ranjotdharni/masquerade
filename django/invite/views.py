import json

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.conf import settings

from bson import ObjectId
from bson.errors import InvalidId
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apiauth.utils import extract_user_from_request
from backend.utils.mongo import get_survey_metadata_bulk
from .serializers import InviteSerializer
from .models import Invite

@method_decorator(csrf_protect, name="dispatch")
class SentInvites(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = Response({ "error": True, "message": "500 Internal Server Error (Unknown)." }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user = extract_user_from_request(request)
            requestHasParams = "id" in request.GET

            if isinstance(user, dict) and user["error"]:
                return Response({"error": True, "message": user["message"] or "Improper request format."}, status.HTTP_400_BAD_REQUEST)

            if (requestHasParams):
                sid = request.GET["id"]
                invites = Invite.objects.filter(survey=sid, sender=user.username)
            else:
                invites = Invite.objects.filter(sender=user.username)

            bulk_metadata = get_survey_metadata_bulk([invite.survey for invite in invites], settings.SURVEY_METADATA_FORMAT)
            serializer = InviteSerializer(
                invites,
                many=True,
                context={
                    "with_metadata": True,
                    "bulk_metadata": bulk_metadata
                }
            )

            response = Response({ "success": True, "content": serializer.data }, status.HTTP_200_OK)
        except (InvalidId, TypeError):
            return response

        return response
