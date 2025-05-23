from rest_framework import serializers
from .models import Task
from accounts.models import User 
from grants.models import Grant 
from grants.serializers import BasicGrantSerializer 

class BasicUserSerializer(serializers.ModelSerializer): 
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_active=True), 
        allow_null=True, 
        required=False 
    )
    assigned_to_details = BasicUserSerializer(source='assigned_to', read_only=True)
    assigned_by_details = BasicUserSerializer(source='assigned_by', read_only=True)
    grant = serializers.PrimaryKeyRelatedField(
        queryset=Grant.objects.all(),
        allow_null=True,
        required=False # Task can exist without a grant
    )
    grant_details = BasicGrantSerializer(source='grant', read_only=True)
    is_grant_follow_up_task = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 
            'assigned_to', 
            'assigned_to_details', 
            'assigned_by', 
            'assigned_by_details', 
            'status', 'priority', 
            'due_date', 'created_at', 'updated_at',
            'grant', 
            'grant_details', 
            'is_grant_follow_up_task'
        ]
        read_only_fields = [
            'id', 'assigned_by', 'assigned_by_details', 
            'created_at', 'updated_at', 'assigned_to_details',
            'grant_details', 'is_grant_follow_up_task'
        ]

    def validate_assigned_to(self, value):
        # Example: You could add a check here to prevent assigning tasks to super_admins
        # if value and value.role == 'super_admin':
        #     raise serializers.ValidationError("Super admins cannot be assigned tasks directly via this field.")
        return value

    def create(self, validated_data):
        # assigned_by will be set in the view using perform_create
        return super().create(validated_data)