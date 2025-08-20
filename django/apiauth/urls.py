from django.urls import path

from .views import GoogleSignIn, SignOut

urlpatterns = [
    path('google/init/', GoogleSignIn.as_view(), name="google_init"),
    path('signout/', SignOut.as_view(), name="sign_out"),
]
