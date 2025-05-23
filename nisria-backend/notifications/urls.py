from django.urls import path
from . import views

urlpatterns = [
    path('', views.indexTest, name='indexTest'),
]