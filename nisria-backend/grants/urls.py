from django.urls import path
from . import views

# Create your views here.
urlpatterns = [
    path('', views.grant_list_create, name='grant-list-create'),
    path('<int:id>/', views.grant_detail, name='grant-detail'),
    path('filter/', views.grant_filter, name='grant-filter'),
    path('search/', views.grant_search, name='grant-search'),
]
