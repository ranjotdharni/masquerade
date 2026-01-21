from django.conf import settings
from rest_framework import serializers
from .models import Invite
from backend.utils.mongo import get_survey_metadata

class InviteSerializer(serializers.ModelSerializer):
    metadata = serializers.SerializerMethodField()

    class Meta:
        model = Invite
        fields = ("survey", "metadata")

    def get_metadata(self, invite):
        bulk_metadata = self.context.get("bulk_metadata")

        if not self.context.get("with_metadata") and not bulk_metadata:
            return None

        if self.many or bulk_metadata:
            if not bulk_metadata:
                return None
            return bulk_metadata.get(invite.survey)
        
        return get_survey_metadata(invite.survey, settings.SURVEY_METADATA_FORMAT)
