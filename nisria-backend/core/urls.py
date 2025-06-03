from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('recycle-bin/', views.recycle_bin_list_view, name='recycle_bin_list'),
    path('recycle-bin/<int:pk>/restore/', views.recycle_bin_restore_view, name='recycle_bin_restore'),
    path('recycle-bin/<int:pk>/delete/', views.recycle_bin_permanently_delete_view, name='recycle_bin_permanently_delete'),
]