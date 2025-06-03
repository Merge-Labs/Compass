from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from decimal import Decimal # Import Decimal
import uuid, datetime # Import datetime

class RecycleBinItem(models.Model):
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        help_text="The model of the deleted item."
    )
    object_id_int = models.PositiveIntegerField(
        null=True, blank=True, help_text="The primary key of the deleted item if integer."
    )
    object_id_uuid = models.UUIDField(
        null=True, blank=True, help_text="The primary key of the deleted item if UUID."
    )
    # content_object = GenericForeignKey('content_type', 'object_id') # We might not use this directly if the object is truly gone or to avoid fetching it.

    original_data = models.JSONField(help_text="A JSON representation of the deleted item's data.")
    deleted_at = models.DateTimeField(default=timezone.now)
    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_items_in_bin'
    )
    
    expires_at = models.DateTimeField()

    restored_at = models.DateTimeField(null=True, blank=True)
    restored_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='restored_items_from_bin'
    )

    class Meta:
        ordering = ['-deleted_at']
        verbose_name = "Recycle Bin Item"
        verbose_name_plural = "Recycle Bin Items"

    def __str__(self):
        return f"Deleted {self.content_type.model} (ID: {self.object_id_int or self.object_id_uuid}) at {self.deleted_at}"

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(days=70)
        super().save(*args, **kwargs)

    @property
    def actual_object_id(self):
        return self.object_id_int or self.object_id_uuid

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    def get_original_object(self):
        """Tries to fetch the original object if it still exists (e.g., soft-deleted)."""
        ModelClass = self.content_type.model_class()
        if ModelClass is None:
            return None
        try:
            # Use all_objects manager if available to fetch soft-deleted items
            manager = getattr(ModelClass, 'all_objects', ModelClass.objects)
            return manager.get(pk=self.actual_object_id)
        except ModelClass.DoesNotExist:
            return None

class SoftDeleteQuerySet(models.QuerySet):
    def delete(self, user=None):
        # This is for bulk delete. Individual delete is handled by the model's delete method.
        if user and user.role != 'super_admin':
            for obj in self:
                obj.soft_delete(user)
        else:
            super().delete()

    def hard_delete(self):
        super().delete()
        
    def restore(self):
        return self.update(is_deleted=False, deleted_at=None)

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)

    def archives(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=True)

    def all_with_deleted(self):
        return SoftDeleteQuerySet(self.model, using=self._db)
    

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # To access all items, including soft-deleted ones

    class Meta:
        abstract = True

    def _get_serializable_data(self):
        """Prepares data for JSON serialization for the Recycle Bin."""
        data = {}
        for field in self._meta.fields:
            if field.name in ['is_deleted', 'deleted_at']: # Don't store these in original_data
                continue
            value = getattr(self, field.name)

            if isinstance(value, models.Model): # Handle ForeignKey fields
                # Get the primary key of the related object
                pk_value = value.pk
                # Check if the primary key is a UUID and convert to string if so
                if isinstance(pk_value, uuid.UUID):
                    data[field.name] = str(pk_value)
                else:
                    data[field.name] = pk_value
            elif isinstance(value, timezone.datetime):
                data[field.name] = value.isoformat()
            elif isinstance(value, uuid.UUID): # Handle UUID fields
                 data[field.name] = str(value)
            elif isinstance(value, Decimal): # Handle Decimal fields
                data[field.name] = str(value) # Convert Decimal to string
            elif isinstance(value, datetime.date): # Handle date fields
                data[field.name] = value.isoformat()
            else: # Handle other serializable types
                data[field.name] = value
        return data


    def soft_delete(self, user):
        RecycleBinItem.objects.create(
            content_type=ContentType.objects.get_for_model(self.__class__),
            object_id_int=self.pk if isinstance(self.pk, int) else None,
            object_id_uuid=self.pk if not isinstance(self.pk, int) else None,
            original_data=self._get_serializable_data(),
            deleted_by=user
        )
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])

    def delete(self, using=None, keep_parents=False, user=None):
        if user and getattr(user, 'role', None) != 'super_admin':
            self.soft_delete(user)
        else:
            # Superadmin or no user context implies hard delete
            super().delete(using=using, keep_parents=keep_parents)

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])
        # Mark as restored in RecycleBin
        RecycleBinItem.objects.filter(
            content_type=ContentType.objects.get_for_model(self.__class__),
            object_id_int=self.pk if isinstance(self.pk, int) else None,
            object_id_uuid=self.pk if not isinstance(self.pk, int) else None,
            restored_at__isnull=True
        ).update(restored_at=timezone.now()) # restored_by would need user context
