from django.urls import path

from .views import SentInvites

urlpatterns = [
    path('sent/', SentInvites.as_view(), name="invite_sent"),
]
