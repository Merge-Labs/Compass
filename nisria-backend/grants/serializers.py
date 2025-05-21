from rest_framework import serializers
from .models import Grant, GrantExpenditure
from documents.models import Document  # assuming Document is in a separate app


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


class GrantExpenditureSerializer(serializers.ModelSerializer):
    usage_percent = serializers.SerializerMethodField()

    class Meta:
        model = GrantExpenditure
        fields = ['amount_used', 'estimated_depletion_date', 'usage_percent']

    def get_usage_percent(self, obj):
        return round(obj.usage_percent(), 2)


class GrantSerializer(serializers.ModelSerializer):
    required_documents = DocumentSerializer(many=True, read_only=True)
    submitted_documents = DocumentSerializer(many=True, read_only=True)
    expenditure = GrantExpenditureSerializer(read_only=True)
    submitted_by = serializers.StringRelatedField()  # optional: make this User-readable

    class Meta:
        model = Grant
        fields = [
            'id',
            'organization_name',
            'application_link',
            'amount_currency',
            'amount_value',
            'notes',
            'status',
            'required_documents',
            'submitted_documents',
            'contact_tel',
            'contact_email',
            'location',
            'organization_type',
            'application_deadline',
            'submitted_by',
            'award_date',
            'date_created',
            'date_updated',
            'expenditure',
        ]
