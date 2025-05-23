from rest_framework import serializers
from .models import Notification
# from accounts.serializers import BasicUserSerializer # If you have one for recipient details

class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.CharField(source='recipient.email', read_only=True)
    # You could add more recipient details if needed, e.g., using BasicUserSerializer

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient_email', 'message',
            'notification_type', 'read_status', 'created_at', 'link'
        ]
        read_only_fields = [
            'id', 'recipient_email', 'message',
            'notification_type', 'created_at', 'link'
        ] # read_status can be updated by specific endpoints