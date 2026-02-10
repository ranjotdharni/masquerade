import requests
import uuid

from urllib.parse import quote

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.http import JsonResponse
from django.conf import settings
from django.db import IntegrityError

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .utils import decode_google_jwt, decode_github_token_response, get_user_from_access_token, generate_provider_response, generate_basic_response
from .models import SocialAccount

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

@method_decorator(csrf_exempt, name='dispatch')
class BasicSignIn(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({ "error": "true", "message": "Email and/or Password missing." }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(username=email)
            if not user.has_usable_password():
                social_account = SocialAccount.objects.get(user=user)
                provider = social_account.provider
                provider_name = settings.AUTH_ID_LIST[provider]

                return Response({ "error": "true", "message": f"Please sign in with {provider_name}." }, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            pass  # let authenticate handle the generic failure
        
        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response({ "error": "true", "message": "Incorrect email or password." }, status=status.HTTP_401_UNAUTHORIZED)
        
        response = generate_basic_response(request, user)

        return response

@method_decorator(csrf_exempt, name='dispatch')
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

            response = generate_basic_response(request, user)

            return response
        except IntegrityError as e:
            user = User.objects.get(username=email)
            social_account = SocialAccount.objects.get(user=user)

            provider = social_account.provider
            provider_name = settings.AUTH_ID_LIST[provider]

            response = Response({ "error": "true", "message": f"Sign in with {provider_name}." }, status=status.HTTP_403_FORBIDDEN)
            return response
        except Exception as e:
            response = Response({ "error": "true", "message": f"500 Internal Server Error" }, status=status.HTTP_403_FORBIDDEN)
            return response

@method_decorator(csrf_exempt, name='dispatch')
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

        return redirect(google_oauth_url)

@method_decorator(csrf_exempt, name='dispatch') 
class GoogleTokenExchange(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = None 
        social_account = None
        user = None
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

                response = generate_provider_response(request, user)
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

@method_decorator(csrf_exempt, name='dispatch') 
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

        return redirect(github_oauth_url)

@method_decorator(csrf_exempt, name='dispatch')   
class GithubTokenExchange(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = None 
        social_account = None
        user = None
        redirect_url = f"{settings.FRONTEND_URL}/login"

        try:
            code = request.GET.get("code")

            github_token_url = f"https://github.com/login/oauth/access_token?client_id={settings.GITHUB_CLIENT_ID}&client_secret={settings.GITHUB_CLIENT_SECRET}&code={code}"

            token_response = requests.get(github_token_url)
            decryption_result = decode_github_token_response(response=token_response)

            if ("email" not in decryption_result or "id" not in decryption_result):
                print(decryption_result["message"])
                redirect_url = (
                    f"{settings.FRONTEND_URL}/login?"
                    f"error=500_INTERNAL_SERVER_ERROR"
                )
                response = redirect(redirect_url)
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

                response = generate_provider_response(request, user)
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
