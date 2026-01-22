from django.urls import path

from .views import Invites, SentInvites

urlpatterns = [
    path('send/', Invites.as_view(), name="send_invite"),
    path('sent/', SentInvites.as_view(), name="invite_sent"),
]
