from celery import shared_task
from django.core.management import call_command
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task
def run_expire_pending_grants_command():
    """
    Celery task to run the expire_pending_grants management command.
    """
    logger.info(f"Celery task 'run_expire_pending_grants_command' initiated at {timezone.now()}")
    call_command('expire_pending_grants')
    logger.info(f"Celery task 'run_expire_pending_grants_command' completed at {timezone.now()}")