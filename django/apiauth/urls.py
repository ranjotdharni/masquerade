from django.urls import path

from .views import GoogleTokenExchange

urlpatterns = [
    path('', GoogleTokenExchange.as_view(), name="token_exchange"),
]
