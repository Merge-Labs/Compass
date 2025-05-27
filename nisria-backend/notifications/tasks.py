from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging
from django.conf import settings

from django.contrib.auth import get_user_model
from .models import Notification

# It's good practice to import Grant and Task models within the task function
# or ensure they are available if GRANTS_APP_AVAILABLE pattern is used.
try:
    from grants.models import Grant
    GRANTS_APP_AVAILABLE = True
except ImportError:
    GRANTS_APP_AVAILABLE = False
    Grant = None

try:
    from task_manager.models import Task
    TASK_MANAGER_APP_AVAILABLE = True
except ImportError:
    TASK_MANAGER_APP_AVAILABLE = False
    Task = None

User = get_user_model()
logger = logging.getLogger(__name__)

@shared_task
def send_actual_notification(notification_id):
    """
    Placeholder for sending the actual notification (e.g., email, push).
    For now, it just logs.
    """
    try:
        notification = Notification.objects.get(id=notification_id)
        logger.info(f"Sending notification (ID: {notification.id}): '{notification.message}' to {notification.recipient.email}")
        # TODO: Implement actual sending logic here (e.g., email using Django's send_mail)
        # from django.core.mail import send_mail
        # from django.conf import settings
        # send_mail(
        #     subject=f"New Notification: {notification.get_notification_type_display()}",
        #     message=f"{notification.message}\n\nView details: {settings.FRONTEND_URL}{notification.link}" if notification.link else notification.message,
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[notification.recipient.email],
        #     fail_silently=False,
        # )
        logger.info(f"Successfully processed notification ID: {notification_id} for {notification.recipient.email}")
    except Notification.DoesNotExist:
        logger.error(f"Notification with ID {notification_id} not found.")
    except Exception as e:
        logger.error(f"Error sending notification ID {notification_id}: {e}")

@shared_task
def create_task_assignment_notification_task(task_id, user_id, assigner_id):
    if not TASK_MANAGER_APP_AVAILABLE or not Task:
        logger.warning("Task Manager app or Task model not available. Skipping task assignment notification.")
        return

    try:
        task = Task.objects.get(id=task_id)
        recipient = User.objects.get(id=user_id)
        assigner_obj = User.objects.get(id=assigner_id) if assigner_id else None

        message = f"You have been assigned a new task: '{task.title}'"

        # if assigner:
        #     # Attempt to get a meaningful name for the assigner
        #     assigner_identifier = assigner_obj.get_full_name() # Uses the overridden get_full_name from your User model

        #     # If get_full_name() returns an empty string, "None", or "None None", it's not ideal.
        #     # In such cases, fall back to the assigner's email.
        #     if not assigner_identifier or assigner_identifier.lower() in ["none", "none none"]:
        #         assigner_identifier = assigner_obj.email
            
        #     if assigner_identifier: # If a usable identifier (name or email) was found
        #         message += f" by {assigner_identifier}."
        #     else:
        #         # If no usable identifier, just end the sentence.
        #         message += "."
        # else:
        #     # No assigner was provided
        #     message += "."
        
        task_link = f"/tasks/{task.id}/" # Adjust if you have a frontend, e.g., /app/tasks/{task.id}

        notification = Notification.objects.create(
            recipient=recipient,
            assigner=assigner_obj, # Save the assigner object
            message=message,
            notification_type='task_assigned',
            link=task_link
        )
        send_actual_notification.delay(notification.id)
        logger.info(f"Created task assignment notification for task '{task.title}' to user '{recipient.email}'.")
    except Task.DoesNotExist:
        logger.error(f"Task with ID {task_id} not found for notification.")
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} or assigner ID {assigner_id} not found for task notification.")
    except Exception as e:
        logger.error(f"Error creating task assignment notification: {e}")

@shared_task
def check_grant_deadlines_and_notify_task():
    if not GRANTS_APP_AVAILABLE or not Grant:
        logger.warning("Grants app or Grant model not available. Skipping grant deadline check.")
        return

    logger.info("Running daily check for grant application deadlines...")
    today = timezone.now().date()
    deadline_threshold_end = today + timedelta(days=7)

    pending_grants_nearing_deadline = Grant.objects.filter(
        status='pending',
        application_deadline__isnull=False,
        application_deadline__gte=today, # Deadline is today or in the future
        application_deadline__lte=deadline_threshold_end # And within the next 7 days
    ).select_related('submitted_by')

    all_active_users = User.objects.filter(is_active=True)
    if not all_active_users.exists():
        logger.info("No active users found to send grant deadline notifications.")
        return

    for grant in pending_grants_nearing_deadline:
        days_left = (grant.application_deadline - today).days
        message = f"Reminder: Grant '{grant.organization_name}' deadline is in {days_left} day(s) on {grant.application_deadline.strftime('%Y-%m-%d')}."
        grant_link = f"/grants/{grant.id}/" # Adjust if you have a frontend

        for user_recipient in all_active_users:
            # Avoid duplicate notifications for the same grant to the same user on the same day for this type
            if not Notification.objects.filter(
                recipient=user_recipient,
                notification_type='grant_deadline_reminder',
                link__icontains=f"/grants/{grant.id}/", # Check against the grant link to identify the grant
                created_at__date=today
            ).exists():
                notification = Notification.objects.create(recipient=user_recipient, message=message, notification_type='grant_deadline_reminder', link=grant_link)
                send_actual_notification.delay(notification.id)
                logger.info(f"Created grant deadline reminder for '{grant.organization_name}' to '{user_recipient.email}'.")
    logger.info("Finished daily check for grant application deadlines.")

@shared_task
def create_bank_statement_access_granted_notification_task(user_id, document_name, pin_value):
    """
    Creates a notification when a user's request for bank statement access is granted.
    """
    try:
        recipient = User.objects.get(id=user_id)
        message = f"Your request to access the bank statement '{document_name}' has been granted. You can now use PIN: {pin_value} to view the document."
        # Consider adding a direct link to where the user can enter the PIN if available.

        link = "/finance/validate-bank-statement-pin/" # fix for frontend

        notification = Notification.objects.create(
            recipient=recipient,
            message=message,
            notification_type='bank_statement_access_granted'
            # assigner is intentionally left None as this is a system notification for the user's own action
        )
        send_actual_notification.delay(notification.id)
        print(f"Bank statement access granted notification prepared for user {user.id} regarding document '{document_name}'.")
        logger.info(f"Created bank statement access GRANTED notification for document '{document_name}' to user '{recipient.email}'.")
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} not found for bank statement access granted notification.")
    except Exception as e:
        logger.error(f"Error creating bank statement access granted notification for user ID {user_id}, document '{document_name}': {e}")
