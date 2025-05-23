from django.db import models
from django.conf import settings 
from grants.models import Grant

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='assigned_tasks',
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_tasks',
        on_delete=models.SET_NULL,
        null=True 
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    grant = models.ForeignKey(
        Grant, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='tasks',
        help_text="Link to a grant if this task is related to one."
    )
    is_grant_follow_up_task = models.BooleanField(default=False, help_text="True if this task was auto-created for a pending grant.")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
