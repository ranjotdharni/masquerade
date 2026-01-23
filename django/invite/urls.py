from django.urls import path

from .views import Invites, ReceivedInvites, DeclineInvites #, SentInvites

urlpatterns = [
    path('send/', Invites.as_view(), name="send_invite"),
    # path('sent/', SentInvites.as_view(), name="invite_sent"),
    path('received/', ReceivedInvites.as_view(), name="invite_received"),
    path('decline/', DeclineInvites.as_view(), name="decline_invite"),
]
