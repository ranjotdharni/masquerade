from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class SocialAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="social_account")
    provider = models.SmallIntegerField()
    uid = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("provider", "uid")

    def __str__(self):
        return f"{self.user.email} via {settings.AUTH_ID_LIST[self.provider]}"
