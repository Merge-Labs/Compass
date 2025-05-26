from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_analytics, name='dashboard_analytics'), 
    path('growth/grants-per-week/', views.grant_growth_analytics_weekly, name='grant_growth_weekly'), 
    path('types/grants-by-organization-type/', views.grant_types_analytics, name='grant_types_analytics'),
    path('types/documents-by-type/', views.document_types_analytics, name='document_types_analytics'),
    path('users/by-role/', views.user_roles_analytics, name='user_roles_analytics'),
    path('users/by-location/', views.user_location_analytics, name='user_location_analytics'),
]