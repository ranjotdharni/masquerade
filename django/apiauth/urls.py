from django.urls import path

from .views import GoogleSignIn, ConfirmAuth

urlpatterns = [
    path('google/init/', GoogleSignIn.as_view(), name="google_init"),
    path('confirm/', ConfirmAuth.as_view(), name="confirm_auth"),
]
