from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notification_type', 'message_summary', 'read_status', 'created_at', 'link')
    list_filter = ('notification_type', 'read_status', 'created_at', 'recipient')
    search_fields = ('recipient__email', 'recipient__full_name', 'message')
    readonly_fields = ('created_at',)

    def message_summary(self, obj):
        return (obj.message[:75] + '...') if len(obj.message) > 75 else obj.message
    message_summary.short_description = 'Message'
