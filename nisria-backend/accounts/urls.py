from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user, get_profile, update_profile, change_password, list_users, delete_user, indexTest, CustomTokenObtainPairView, LogoutView
# Create your views here.
urlpatterns = [
    path('', indexTest, name='indexTest'),

    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('register/', register_user, name='register_user'),
    path('me/', get_profile, name='get_profile'),
    path('me/update/', update_profile, name='update_profile'),
    path('me/change-password/', change_password, name='change_password'),

    path('users/', list_users, name='list_users'),  # Super Admin only
    path('users/<uuid:pk>/delete/', delete_user, name='delete_user'), # Super Admin only
]
