import requests

from django.shortcuts import redirect
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from .utils import decode_google_jwt

# Create your views here.

class TestView(APIView):
    def get(self, request):
        client = settings.MONGO_CLIENT

        try:
            client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

        return Response({ "message": "successful test" }, status=200)
    
class GoogleTokenExchange(APIView):
    def get(self, request):
        code = request.GET.get("code")

        google_token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": f"{settings.BACKEND_URL}/api/auth/google/login/callback/",  # must match what you registered with Google
            "grant_type": "authorization_code",
        }

        token_response = requests.post(google_token_url, data=data)
        token_json = token_response.json()

        id_token = token_json.get("id_token")

        decryption_result = decode_google_jwt(id_token=id_token)
        redirect_url = ""

        if ("error" in decryption_result):
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error={decryption_result.message}"
            )
        else:
            print(decryption_result["email"])
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"access=success&refresh=success"
            )

        return redirect(redirect_url)
