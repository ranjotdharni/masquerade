import requests

from urllib.parse import quote

from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token
from django.contrib.auth import get_user_model, login
from django.shortcuts import redirect
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .utils import decode_google_jwt
from .models import SocialAccount

User = get_user_model()

# Create your views here.

class ConfirmAuth(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("You are authenticated!")
        return Response({ "success": True }, status=200)

class GoogleSignIn(APIView):
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def get(self, request):
        response = None 
        social_account = None
        user = None
        redirect_url = ""
        access_token = ""
        refresh_token = ""

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
                email = decryption_result["email"]
                uid = decryption_result["sub"]

                try:
                    social_account = SocialAccount.objects.get(provider=settings.GOOGLE_AUTH_ID, uid=uid)
                    user = social_account.user
                except SocialAccount.DoesNotExist:
                    user = User.objects.create(
                        username=email
                    )

                    user.set_unusable_password()
                    user.save()

                    social_account = SocialAccount.objects.create(
                        user=user,
                        provider=settings.GOOGLE_AUTH_ID,
                        uid=uid
                    )

                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                csrf_token = get_token(request=request)

                redirect_url = (
                    f"{settings.FRONTEND_URL}/login#"
                    f"{settings.ACCESS_TOKEN_NAME}={access_token}"
                )
                response = redirect(redirect_url)

                response.set_cookie(
                    key=settings.CSRF_COOKIE_NAME,
                    value=csrf_token,
                    httponly=False,
                    secure=True,
                    samesite="None"
                )
                response.set_cookie(
                    key=settings.REFRESH_COOKIE_NAME,
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite="None"
                )
        except Exception as e:
            print(e.with_traceback())
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error=500"
            )
            response = redirect(redirect_url)

        return response
