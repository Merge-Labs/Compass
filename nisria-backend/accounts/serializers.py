from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'role', 'profile_picture', 'location', 'date_created', 'date_updated']
        read_only_fields = ['id', 'date_created', 'date_updated', 'role']


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        # Ensure 'profile_picture' is included if you want to set it during registration
        fields = ['email', 'full_name', 'phone_number', 'password', 'role', 'location', 'profile_picture'] 
        extra_kwargs = {
            'profile_picture': {'required': False} # Make it optional during registration
        }


    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            role=validated_data.get('role'), 
            location=validated_data.get('location'),
            profile_picture=validated_data.get('profile_picture') # Add this
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD  # This tells JWT to use `email`

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.full_name,
            'role': self.user.role,
        }
        return data