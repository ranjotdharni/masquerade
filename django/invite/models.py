from django.db import models
from django.conf import settings

# Create your models here.
class Invite(models.Model):
    pk = models.CompositePrimaryKey('survey', 'recipient')
    survey = models.CharField(max_length=24)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE, db_column='sender', to_field='username', blank=True, null=True)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE, db_column='recipient', to_field='username', related_name='invites_recipient_set')

    class Meta:
        db_table = 'invites'
        unique_together = (('sender', 'recipient'),)
