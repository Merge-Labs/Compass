from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    document_format_display = serializers.CharField(source='get_document_format_display', read_only=True)
    division_display = serializers.CharField(source='get_division_display', read_only=True)

    class Meta:
        model = Document
        fields = [
            'id',
            'name',
            'description',
            'document_type',
            'document_type_display',
            'document_format',
            'document_format_display',
            'document_link',
            'division',
            'division_display',
            'date_uploaded'
        ]
        read_only_fields = ['date_uploaded']


# class DocumentAccessRequestSerializer(serializers.Serializer):
#     document_id = serializers.IntegerField()
#     user_email = serializers.EmailField()
#     reason = serializers.CharField(max_length=1000)


# class GrantAccessSerializer(serializers.Serializer):
#     user_email = serializers.EmailField()
#     access_level = serializers.ChoiceField(choices=[
#         ('read', 'Read'),
#         ('download', 'Download'),
#         ('edit', 'Edit'),
#     ])
