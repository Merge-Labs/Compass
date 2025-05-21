from django.urls import path
from .views import indexTest, email_template_list_create_view, email_template_detail_view, render_email_template_view, export_email_template_view

# Create your views here.
urlpatterns = [
    # path('', indexTest, name='indexTest'),
    path('', email_template_list_create_view, name='email_template_list_create'),
    path('<int:pk>/', email_template_detail_view, name='email_template_detail'),
    path('<int:pk>/render/', render_email_template_view, name='render_email_template'),
    path('<int:pk>/export/', export_email_template_view, name='export_email_template'),
]
