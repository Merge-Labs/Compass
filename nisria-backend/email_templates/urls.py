from django.urls import path
from . import views

urlpatterns = [
    # path('', indexTest, name='indexTest'),
    path('', views.email_template_list_create_view, name='email_template_list_create'),
    path('<uuid:pk>/', views.email_template_detail_view, name='email_template_detail'),
    path('<uuid:pk>/render/', views.render_email_template_view, name='render_email_template'),
    path('<uuid:pk>/export/', views.export_email_template_view, name='export_email_template'),
     path('<uuid:pk>/soft-delete/', views.email_template_soft_delete, name='email-template-soft-delete'),
    path('recycle-bin/', views.email_template_recycle_bin, name='email-template-recycle-bin'),
    path('<uuid:pk>/restore/', views.email_template_restore, name='email-template-restore'),
    path('<uuid:pk>/permanent-delete/', views.email_template_permanent_delete, name='email-template-permanent-delete'),
]
