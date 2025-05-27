from rest_framework import serializers
from .models import Notification
# from accounts.serializers import BasicUserSerializer # If you have one for recipient details

class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.CharField(source='recipient.email', read_only=True)
    assigner_full_name = serializers.CharField(source='assigner.full_name', read_only=True, allow_null=True)
    # You could add more recipient details if needed, e.g., using BasicUserSerializer

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient_email', 'assigner_full_name', 'message',
            'notification_type', 'read_status', 'created_at', 'link'
        ]
        read_only_fields = [
            'id', 'recipient_email', 'assigner_full_name',
            'message', # Message is constructed in tasks.py
            'notification_type', 'created_at', 'link'
        ] # read_status can be updated by specific endpoints