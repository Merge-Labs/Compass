from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_analytics, name='dashboard_analytics'),
]