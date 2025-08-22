from django.urls import path

from .views import GoogleSignIn, GithubSignIn, SignOut, RefreshTokens, ConfirmAuth

urlpatterns = [
    path('google/init/', GoogleSignIn.as_view(), name="google_init"),
    path('github/init/', GithubSignIn.as_view(), name="github_init"),
    path('signout/', SignOut.as_view(), name="sign_out"),
    path('refresh/', RefreshTokens.as_view(), name="refresh_tokens"),
    path('confirm/', ConfirmAuth.as_view(), name="confirm_auth"),
]
