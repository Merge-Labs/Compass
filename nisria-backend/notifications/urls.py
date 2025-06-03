from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserNotificationListView.as_view(), name='user-notification-list'),
    path('unread-count/', views.unread_notifications_count, name='user-unread-notifications-count'),
    path('<uuid:notification_id>/mark-as-read/', views.mark_notification_as_read, name='mark-notification-as-read'),
    path('mark-all-as-read/', views.mark_all_notifications_as_read, name='mark-all-notifications-as-read'),
    path('<uuid:notification_id>/delete/', views.delete_notification, name='delete-notification'),
]