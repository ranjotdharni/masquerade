from django.urls import path

from .views import GoogleSignIn, SignOut, RefreshTokens

urlpatterns = [
    path('google/init/', GoogleSignIn.as_view(), name="google_init"),
    path('signout/', SignOut.as_view(), name="sign_out"),
    path('refresh/', RefreshTokens.as_view(), name="refresh_tokens")
]
