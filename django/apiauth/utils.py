import requests
import jwt

from backend.helpers import GenericError
from django.conf import settings
from jwt.algorithms import RSAAlgorithm

from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth import get_user_model

GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"

User = get_user_model()

def get_user_from_access_token(token):
    try:
        validated_token = UntypedToken(token)
    except Exception as e:
        return GenericError(message="Could not decode token.").to_dict()

    user_id = validated_token['user_id']

    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return GenericError(message="User not found.").to_dict()

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
    
    return GenericError(message="Google-issued tokens are invalid.").to_dict()

def decode_github_token_response(response):
    try:
        token_content = response._content.decode("utf-8")
        
        items = token_content.split("&")
        github_access_token_array = items[0].split("=")

        github_access_token = github_access_token_array[1]
        
        headers = { "Authorization": f"Bearer {github_access_token}" }
        response = requests.get("https://api.github.com/user", headers=headers)
        payload = response.json()

        return payload
    except Exception as e:
        print(e)
        return GenericError(message="Could not decode token.").to_dict()
