from django.urls import path
from .views import indexTest

# Create your views here.
urlpatterns = [
    path('', indexTest, name='indexTest')
]
