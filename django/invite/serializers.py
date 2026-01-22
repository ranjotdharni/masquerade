import json

from django.conf import settings
from rest_framework import serializers
from .models import Invite
from backend.utils.mongo import get_survey_metadata
from backend.utils.static.encoders import MongoJSONEncoder

class InviteSerializer(serializers.ModelSerializer):
    metadata = serializers.SerializerMethodField()

    class Meta:
        model = Invite
        fields = ("survey", "metadata")

    def get_metadata(self, invite):
        bulk_metadata = self.context.get("bulk_metadata")

        if not self.context.get("with_metadata") and not bulk_metadata:
            return None

        if bulk_metadata:
            return json.loads(MongoJSONEncoder().encode(bulk_metadata.get(invite.survey)))
        
        return json.loads(MongoJSONEncoder().encode(get_survey_metadata(invite.survey, settings.SURVEY_METADATA_FORMAT)))
