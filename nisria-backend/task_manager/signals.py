from django.db.models.signals import post_save
from django.dispatch import receiver
from celery import current_app
from .models import Task

@receiver(post_save, sender=Task)
def task_saved_handler(sender, instance, created, update_fields, **kwargs):
    """
    Handles actions after a Task is saved.
    Sends a notification if a task is newly assigned or re-assigned.
    """
    if not instance.assigned_to:
        return  # No assignee, no notification

    should_notify = False
    if created: # New task with an assignee
        should_notify = True
    elif update_fields and 'assigned_to' in update_fields: # Existing task, and assigned_to field was specifically updated
        should_notify = True
    # If update_fields is None (full save), it's harder to know if assigned_to changed without comparing old state.
    # This logic covers creation and explicit re-assignment via update_fields.

    if should_notify:
        assigner_id = instance.assigned_by.id if instance.assigned_by else None
        # Use string path to avoid circular imports
        current_app.send_task('notifications.tasks.create_task_assignment_notification_task',
                              args=[instance.id, instance.assigned_to.id, assigner_id])