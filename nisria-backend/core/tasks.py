# /home/manasseh/Documents/Zindua-Software-Dev/final-capstone/nisria-backend/core/tasks.py
from celery import shared_task
from django.utils import timezone
from .models import RecycleBinItem
import logging

logger = logging.getLogger(__name__)

@shared_task
def cleanup_expired_recycle_bin_items():
    expired_items = RecycleBinItem.objects.filter(
        expires_at__lte=timezone.now(),
        restored_at__isnull=True
    )
    count = 0
    for item in expired_items:
        try:
            original_object = item.get_original_object()
            if original_object:
                # Perform a hard delete (assuming superadmin context for tasks or a specific hard_delete method)
                if hasattr(original_object, 'hard_delete'): # Ideal
                    original_object.hard_delete()
                else: # Fallback, assumes delete() without user context is hard delete
                    original_object.delete() 
            
            # Delete the recycle bin entry itself after processing the original
            item.delete()
            count += 1
        except Exception as e:
            logger.error(f"Error permanently deleting expired item {item.id} (Original ID: {item.actual_object_id}, Type: {item.content_type.model}): {e}")
    logger.info(f"Permanently deleted {count} expired items from the recycle bin.")
    return f"Permanently deleted {count} expired items."

