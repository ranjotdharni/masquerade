import requests

from urllib.parse import quote
from django.shortcuts import redirect
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from .utils import decode_google_jwt

# Create your views here.

class GoogleSignIn(APIView):
    def get(self, request):
        server_callback_uri = quote(f"{settings.BACKEND_URL}/api/auth/google/login/callback/", safe="")

        google_oauth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount"
            f"?client_id={settings.GOOGLE_CLIENT_ID}"
            f"&redirect_uri={server_callback_uri}"
            f"&scope=email"
            f"&response_type=code"
            f"&service=lso"
            f"&o2v=2"
            f"&flowName=GeneralOAuthFlow"
        )

        return Response({ "redirect": google_oauth_url }, status=301)
    
class GoogleTokenExchange(APIView):
    def get(self, request):
        redirect_url = ""

        try:
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

            if ("error" in decryption_result):
                redirect_url = (
                    f"{settings.FRONTEND_URL}/login?"
                    f"error={decryption_result.message}"
                )
            else:
                # log user in here
                print(decryption_result["email"])
                redirect_url = (
                    f"{settings.FRONTEND_URL}/login?"
                    f"access=success&refresh=success"
                )
        except Exception as e:
            print(e.with_traceback())
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error=500"
            )

        return redirect(redirect_url)
