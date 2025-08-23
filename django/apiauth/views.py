import requests
import uuid

from urllib.parse import quote

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.http import JsonResponse
from django.conf import settings
from django.db import IntegrityError

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .utils import decode_google_jwt, decode_github_token_response, get_user_from_access_token
from .models import SocialAccount

User = get_user_model()

# Create your views here.

@method_decorator(csrf_protect, name="dispatch")
class ConfirmAuth(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({ "success": "true", "message": "User is logged in." }, status.HTTP_200_OK)
        return response

@method_decorator(csrf_protect, name="dispatch")
class RefreshTokens(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        response = None

        refresh_token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if not refresh_token:
            response = Response({ "error": "true", "message": "Refresh token missing." }, status=status.HTTP_401_UNAUTHORIZED)
            return response
        
        try:
            old_refresh = RefreshToken(refresh_token)
            new_access_token = str(old_refresh.access_token)
            old_refresh.blacklist()

            user = get_user_from_access_token(new_access_token)

            new_refresh_token = RefreshToken.for_user(user)
            refresh = str(new_refresh_token)

            response = Response({ f"{settings.ACCESS_TOKEN_NAME}": new_access_token }, status=status.HTTP_200_OK)

            response.set_cookie(
                key=settings.REFRESH_COOKIE_NAME,
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None"
            )
        except Exception as e:
            response = Response({ "error": "true", "message": "Refresh token invalid." }, status=status.HTTP_401_UNAUTHORIZED)

        return response

@method_decorator(csrf_protect, name="dispatch")
class SignOut(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        response = JsonResponse({ "message": "Logged Out" }, status=status.HTTP_200_OK)

        try:
            refresh_token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return JsonResponse({ "error": "true", "message": "500 Internal Server Error" }, status=status.HTTP_400_BAD_REQUEST)
        
        response.delete_cookie(settings.CSRF_COOKIE_NAME)
        response.delete_cookie(settings.REFRESH_COOKIE_NAME)

        return response  

@method_decorator(csrf_protect, name="dispatch")
class BasicSignUp(APIView):
      permission_classes = [AllowAny]

      def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({ "error": "true", "message": "Email and/or Password missing." }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=email,
                password=password,
            )
            user.save()

            social_account = SocialAccount.objects.create(
                user=user,
                provider=settings.BASIC_AUTH_ID,
                uid=str(uuid.uuid4())
            )

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            csrf_token = get_token(request=request)

            response = Response({ "success": "true", "message": "Account Created.", f"{settings.ACCESS_TOKEN_NAME}": f"{access_token}" }, status=status.HTTP_200_OK)
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

            return response
        except IntegrityError as e:
            user = User.objects.get(username=email)
            social_account = SocialAccount.objects.get(user=user)

            provider = social_account.provider

            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error={settings.DUPLICATE_USER_CODE}"
                f"&provider={provider}"
            )
            return redirect(redirect_url)
        except Exception as e:
            print(e)
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error=500_INTERNAL_SERVER_ERROR"
            )
            return redirect(redirect_url)

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
                print(decryption_result.message)
                redirect_url = (
                    f"{settings.FRONTEND_URL}/login?"
                    f"error=500_INTERNAL_SERVER_ERROR"
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
        except IntegrityError as e:
            user = User.objects.get(username=email)
            social_account = SocialAccount.objects.get(user=user)

            provider = social_account.provider

            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error={settings.DUPLICATE_USER_CODE}"
                f"&provider={provider}"
            )
            response = redirect(redirect_url)
        except Exception as e:
            print(e)
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error=500_INTERNAL_SERVER_ERROR"
            )
            response = redirect(redirect_url)

        return response
    
class GithubSignIn(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        server_callback_uri = quote(f"{settings.BACKEND_URL}/api/auth/github/login/callback/", safe="")

        github_oauth_url = (
            f"https://github.com/login/oauth/authorize"
            f"?client_id={settings.GITHUB_CLIENT_ID}"
            f"&amp;redirect_uri={server_callback_uri}"
            f"&amp;scope=user"
        )

        return Response({ "redirect": github_oauth_url }, status=301)
    
class GithubTokenExchange(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = None 
        social_account = None
        user = None
        redirect_url = f"{settings.FRONTEND_URL}/login"
        access_token = ""
        refresh_token = ""

        try:
            code = request.GET.get("code")

            github_token_url = f"https://github.com/login/oauth/access_token?client_id={settings.GITHUB_CLIENT_ID}&amp;client_secret={settings.GITHUB_CLIENT_SECRET}&amp;code={code}"

            token_response = requests.get(github_token_url)
            decryption_result = decode_github_token_response(response=token_response)

            if ("error" in decryption_result):
                print(decryption_result.message)
                redirect_url = (
                    f"{settings.FRONTEND_URL}/login?"
                    f"error=500_INTERNAL_SERVER_ERROR"
                )
            else:
                # log user in here
                email = decryption_result["email"]
                uid = decryption_result["id"]

                try:
                    social_account = SocialAccount.objects.get(provider=settings.GITHUB_AUTH_ID, uid=uid)
                    user = social_account.user
                except SocialAccount.DoesNotExist:
                    user = User.objects.create(
                        username=email
                    )

                    user.set_unusable_password()
                    user.save()

                    social_account = SocialAccount.objects.create(
                        user=user,
                        provider=settings.GITHUB_AUTH_ID,
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
        except IntegrityError as e:
            user = User.objects.get(username=email)
            social_account = SocialAccount.objects.get(user=user)

            provider = social_account.provider

            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error={settings.DUPLICATE_USER_CODE}"
                f"&provider={provider}"
            )
            response = redirect(redirect_url)
        except Exception as e:
            print(e)
            redirect_url = (
                f"{settings.FRONTEND_URL}/login?"
                f"error=500_INTERNAL_SERVER_ERROR"
            )
            response = redirect(redirect_url)

        return response
