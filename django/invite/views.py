from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.conf import settings

from bson import ObjectId
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from apiauth.utils import extract_user_from_request
from backend.utils.mongo import get_survey_metadata_bulk
from .serializers import InviteSerializer
from .models import Invite

@method_decorator(csrf_protect, name="dispatch")
class Invites(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        surveysCollection = settings.MONGO_CLIENT[settings.DB_DATABASE_NAME][settings.DB_SURVEY_COLLECTION_NAME]
        response = Response({ "success": True, "message": "Invitation processed." }, status.HTTP_200_OK)

        try:
            sender = extract_user_from_request(request)
            data = request.data.dict()
            requestIsMissingInput = "id" not in data or "recipient" not in data

            if isinstance(sender, dict) and sender["error"]:
                return Response({"error": True, "message": sender["message"] or "Cannot identify you. Please log in."}, status.HTTP_401_UNAUTHORIZED)
            
            if requestIsMissingInput:
                return Response({"error": True, "message": "Survey ID or invite recipient was not specified."}, status.HTTP_400_BAD_REQUEST)
            
            sid = data["id"]
            recipient = data["recipient"]
            oid = ObjectId(sid)

            if (sender.username == recipient):
                return response

            requestIsValid = surveysCollection.find_one({
                "_id": oid,
                "creator": sender.username
            }) is not None

            if requestIsValid:
                invite = Invite.objects.create(survey=sid, sender=sender, recipient=User.objects.get(username=recipient))
        except Exception as e:
            '''
            INTENTIONAL CATCH-ALL EXCEPTION! DO NOT REMOVE!
            Reason: User should not be informed of any failure(s) to preserve anonymity.
            '''
            print(e)

        return response

@method_decorator(csrf_protect, name="dispatch")
class SentInvites(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = Response({ "error": True, "message": "500 Internal Server Error (Unknown)." }, status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user = extract_user_from_request(request)
            requestHasParams = "id" in request.GET

            if isinstance(user, dict) and user["error"]:
                return Response({"error": True, "message": user["message"] or "Cannot identify you. Please log in."}, status.HTTP_401_UNAUTHORIZED)

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
        except TypeError:
            return response

        return response
