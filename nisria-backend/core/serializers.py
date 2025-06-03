from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import RecycleBinItem
from django.conf import settings

User = settings.AUTH_USER_MODEL

class RecycleBinItemSerializer(serializers.ModelSerializer):
    content_type_name = serializers.SerializerMethodField()
    deleted_by_email = serializers.SerializerMethodField(method_name='get_deleted_by_user_identifier')
    actual_object_id_display = serializers.CharField(source='actual_object_id', read_only=True)

    class Meta:
        model = RecycleBinItem
        fields = [
            'id',
            'content_type_name',
            'actual_object_id_display',
            'original_data',
            'deleted_at',
            'deleted_by_email',
            'expires_at',
            'is_expired',
            'restored_at',
            'restored_by', # Consider making this a username as well if needed
        ]

    def get_content_type_name(self, obj):
        return obj.content_type.model

    def get_deleted_by_user_identifier(self, obj):
        return obj.deleted_by.email if obj.deleted_by else None