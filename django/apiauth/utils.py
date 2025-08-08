import requests
import jwt

from backend.helpers import GenericError
from django.conf import settings
from jwt.algorithms import RSAAlgorithm

GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"

def decode_google_jwt(id_token):
    certs = requests.get(GOOGLE_CERTS_URL).json()

    for key in certs['key']:
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
    
    return GenericError("Google-issued tokens are invalid.").to_dict()
