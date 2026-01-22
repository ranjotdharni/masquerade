from django.urls import path

from .views import Invites, SentInvites, ReceivedInvites

urlpatterns = [
    path('send/', Invites.as_view(), name="send_invite"),
    path('sent/', SentInvites.as_view(), name="invite_sent"),
    path('received/', ReceivedInvites.as_view(), name="invite_received"),
]
