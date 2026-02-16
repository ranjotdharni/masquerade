import requests
import json
import jwt

from backend.helpers import GenericError
from django.conf import settings
from jwt.algorithms import RSAAlgorithm

from rest_framework_simplejwt.tokens import UntypedToken, RefreshToken
from django.contrib.auth.models import User
from django.http import HttpRequest, HttpResponseRedirect
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response

GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"

def get_user_from_access_token(token):
    try:
        validated_token = UntypedToken(token)
    except Exception as e:
        return GenericError(message="Could not decode access token.").to_dict()

    user_id = validated_token['user_id']

    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return GenericError(message="User not found.").to_dict()
    
def extract_user_from_request(request):
    error = GenericError(message="Cannot find user, please log in again.")
    header = request.META['HTTP_AUTHORIZATION'] # When passed correctly, this is in the form 'Bearer <access_token>'

    if not header:
        return error
    
    segments = str(header).split()

    if len(segments) != 2:
        return error

    return get_user_from_access_token(segments[1])

def extract_refresh_token_from_request(request):
    error = GenericError(message="Failed to extract refresh token from request.")
    header = request.META['HTTP_AUTHORIZATION']

    if not header:
        return error
    
    segments = str(header).split()

    if len(segments) != 2:
        return error

    return segments[1]

def decode_google_jwt(id_token):
    certs_response = requests.get(GOOGLE_CERTS_URL)
    certs = certs_response.json()

    
    for key in certs['keys']:
        try:
            key = RSAAlgorithm.from_jwk(key)
            payload = jwt.decode(
                id_token,
                key,
                algorithms=['RS256'],
                audience=settings.GOOGLE_CLIENT_ID
            )
            return payload
        except jwt.exceptions.InvalidTokenError:
            continue
    
    return GenericError(message="Could not decode Google credentials.").to_dict()

def decode_github_token_response(response):
    default_error = GenericError(message="Could not decode GitHub credentials.")

    try:
        token_content = response.json()
        
        if "access_token" not in token_content:
            return default_error
        
        github_access_token = token_content["access_token"]
        
        headers = { "Authorization": f"Bearer {github_access_token}" }
        response = requests.get("https://api.github.com/user", headers=headers)
        payload = response.json()

        return payload
    except Exception as e:
        print(e)
        return default_error

def generate_jwt_response(user: User) -> Response:
    try:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({ settings.ACCESS_TOKEN_NAME: access_token, settings.REFRESH_TOKEN_NAME: refresh_token }, status=status.HTTP_200_OK)

        return response
    except Exception as e:
        print(e)
        raise
