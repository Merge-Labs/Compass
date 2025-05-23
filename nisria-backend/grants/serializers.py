from rest_framework import serializers
from .models import Grant, GrantExpenditure
from documents.models import Document  
from divisions.models import Program 

class BasicGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grant
        fields = ['id', 'organization_name', 'status']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class GrantExpenditureSerializer(serializers.ModelSerializer):
    usage_percent = serializers.SerializerMethodField(read_only=True)
    grant_id = serializers.IntegerField(source='grant.id', read_only=True)
    grant_organization_name = serializers.CharField(source='grant.organization_name', read_only=True)

    class Meta:
        model = GrantExpenditure
        fields = [
            'id',
            'grant_id',
            'grant_organization_name',
            'amount_used',
            'estimated_depletion_date',
            'usage_percent'
        ]
        read_only_fields = ['id', 'grant_id', 'grant_organization_name', 'usage_percent']

    def get_usage_percent(self, obj):
        # Relies on the model's method for calculation
        return round(obj.usage_percent(), 2)


class GrantSerializer(serializers.ModelSerializer):
    # Changed to PrimaryKeyRelatedField to accept a list of document IDs on write.
    # The response will also contain a list of document IDs for these fields.
    required_documents = serializers.PrimaryKeyRelatedField(
        queryset=Document.objects.all(),
        many=True,
        required=False  # Set to True if this field must be provided during creation
    )
    submitted_documents = serializers.PrimaryKeyRelatedField(
        queryset=Document.objects.all(),
        many=True,
        required=False, # Set to True if this field must be provided
        allow_empty=True # Allows an empty list to be passed
    )
    expenditure = GrantExpenditureSerializer(read_only=True)
    program = serializers.PrimaryKeyRelatedField(
        queryset=Program.objects.all(),
        allow_null=True,  # Allows not sending program ID
        required=False    # Makes it not mandatory in payload
    )
    program_name = serializers.CharField(source='program.__str__', read_only=True, allow_null=True)
    submitted_by = serializers.StringRelatedField()  # optional: make this User-readable

    class Meta:
        model = Grant
        fields = [
            'id',
            'organization_name',
            'application_link',
            'amount_currency',
            'amount_value',
            'program',
            'program_name',
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
