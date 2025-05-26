from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer, RegisterUserSerializer, ChangePasswordSerializer
from .permissions import IsSuperAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from drf_yasg.utils import swagger_auto_schema

def indexTest(request):
    return JsonResponse({"message": "API endpoints working in accounts app"})

@swagger_auto_schema(   
    method='POST',  
    request_body=RegisterUserSerializer,    
    responses={201: 'User created', 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsSuperAdmin])  # Only Super Admin can create users
def register_user(request):
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered successfully!", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='GET', 
    responses={
        200: UserSerializer,
        400: 'Bad Request',
        401: 'Unauthorized',
        404: 'Profile Not Found'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(   
    method='PUT',  
    request_body=UserSerializer,    
    responses={201: 'User created', 400: 'Bad Request'}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!", 'data': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(   
    method='PUT',  
    request_body=ChangePasswordSerializer,    
    responses={201: 'User created', 400: 'Bad Request'}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    user = request.user

    if serializer.is_valid():
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password updated successfully!"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='GET', 
    responses={
        200: UserSerializer,
        400: 'Bad Request',
        401: 'Unauthorized',
        404: 'Profile Not Found'
    }
)
@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer