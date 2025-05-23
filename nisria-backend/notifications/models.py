from django.db import models
from django.conf import settings
import uuid

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('task_assigned', 'Task Assigned'),
        ('grant_deadline_reminder', 'Grant Deadline Reminder'),
        ('general', 'General Notification'),
        # Add other types as needed
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default='general')
    read_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.URLField(blank=True, null=True, help_text="Optional link to the relevant item (e.g., task, grant)")

    def __str__(self):
        return f"Notification for {self.recipient.email} - Type: {self.get_notification_type_display()}"

    class Meta:
        ordering = ['-created_at']
