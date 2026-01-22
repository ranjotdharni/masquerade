from django.urls import path

from .views import Invite, SentInvites

urlpatterns = [
    path('send/', Invite.as_view(), name="send_invite"),
    path('sent/', SentInvites.as_view(), name="invite_sent"),
]
