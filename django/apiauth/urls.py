from django.urls import path

from .views import GoogleSignIn, LogOut

urlpatterns = [
    path('google/init/', GoogleSignIn.as_view(), name="google_init"),
    path('logout/', LogOut.as_view(), name="logout"),
]
