from django.urls import path

from .views import GoogleSignIn

urlpatterns = [
    path('google/init/', GoogleSignIn.as_view(), name="google_init"),
]
