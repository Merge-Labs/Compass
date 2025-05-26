from django.urls import path
from .views import indexTest, email_template_list_create_view, email_template_detail_view, render_email_template_view, export_email_template_view

# Create your views here.
urlpatterns = [
    # path('', indexTest, name='indexTest'),
    path('', email_template_list_create_view, name='email_template_list_create'),
    path('<uuid:pk>/', email_template_detail_view, name='email_template_detail'),
    path('<uuid:pk>/render/', render_email_template_view, name='render_email_template'),
    path('<uuid:pk>/export/', export_email_template_view, name='export_email_template'),
]
