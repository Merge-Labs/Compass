from rest_framework import serializers
from .models import EmailTemplates

class EmailTemplateSerializer(serializers.ModelSerializer):
    # To display user's full_name. Your User model has 'full_name'.
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_name = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)


    class Meta:
        model = EmailTemplates
        fields = [
            'id',
            'name',
            'template_type',
            'subject_template',
            'body_template',
            'created_by', # Will show user ID by default, useful if client needs the ID
            'created_by_name', # Shows username
            'updated_by', # Will show user ID
            'updated_by_name', # Shows username
            'date_created',
            'last_updated'
        ]
        read_only_fields = ['id', 'date_created', 'last_updated', 'created_by', 'updated_by']
