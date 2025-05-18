from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'role', 'profile_picture', 'location', 'date_created', 'date_updated']
        read_only_fields = ['id', 'date_created', 'date_updated', 'role']


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'password', 'role', 'location']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            # Pass other fields like role and location via **extra_fields
            role=validated_data.get('role'), # Use .get() for optional fields if not always present
            location=validated_data.get('location') # Use .get() for optional fields
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
