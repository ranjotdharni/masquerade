from django.urls import path

from .views import GoogleTokenExchange, GithubTokenExchange, BasicSignUp, BasicSignIn, SignOut, RefreshTokens, ConfirmAuth

urlpatterns = [
    path('google/signin/', GoogleTokenExchange.as_view(), name="google_token_exchange"),
    path('github/signin/', GithubTokenExchange.as_view(), name="github_token_exchange"),
    path('basic/signup/', BasicSignUp.as_view(), name="basic_signup"),
    path('basic/signin/', BasicSignIn.as_view(), name="basic_signin"),
    path('signout/', SignOut.as_view(), name="sign_out"),
    path('refresh/', RefreshTokens.as_view(), name="refresh_tokens"),
    path('confirm/', ConfirmAuth.as_view(), name="confirm_auth"),
]
