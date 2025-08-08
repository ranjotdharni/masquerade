import requests
import jwt

from backend.helpers import GenericError
from django.conf import settings
from jwt.algorithms import RSAAlgorithm

GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"

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
