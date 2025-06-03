from django.db import models
from django.contrib.auth import get_user_model
from documents.models import Document  
from divisions.models import Program
from django.utils import timezone
import uuid
from core.models import SoftDeleteModel

User = get_user_model()


class Grant(SoftDeleteModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('applied', 'Applied'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('expired', 'Expired'),
    ]

    ORG_TYPE_CHOICES = [
        ('normal', 'Normal Company'),
        ('grant_awarder', 'Grant Awarding Company'),
    ]

    organization_name = models.CharField(max_length=255)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_link = models.URLField(blank=True, null=True)
    amount_currency = models.CharField(max_length=10)
    amount_value = models.DecimalField(max_digits=15, decimal_places=2)

    program = models.ForeignKey(
        Program,
        on_delete=models.SET_NULL,  
        null=True,                 
        blank=True,                
        related_name='grants',     
        help_text="The specific program this grant is associated with, if any."
    )

    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    required_documents = models.ManyToManyField(Document, related_name='grants_requiring')
    submitted_documents = models.ManyToManyField(Document, related_name='grants_submitted', blank=True)

    contact_tel = models.CharField(max_length=20)
    contact_email = models.EmailField()
    location = models.CharField(max_length=255)

    organization_type = models.CharField(max_length=20, choices=ORG_TYPE_CHOICES)
    application_deadline = models.DateField(null=True, blank=True)

    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    award_date = models.DateField(null=True, blank=True)

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Import Task model here to avoid circular imports at module level
        from task_manager.models import Task

        is_new = self.pk is None
        old_status = None

        if not is_new:
            # For an existing instance, get its current status from the database
            try:
                old_grant = Grant.objects.get(pk=self.pk)
                old_status = old_grant.status
            except Grant.DoesNotExist:
                # This case implies it's effectively new regarding status change logic
                pass 

        super().save(*args, **kwargs)  # Call the "real" save() method.

        # GrantExpenditure creation logic (existing)
        if self.status == 'approved' and old_status == 'pending':
            GrantExpenditure.objects.get_or_create(grant=self)

        # Automatic Task Management Logic
        # 1. Task Creation: When grant becomes 'pending' (or is created as 'pending')
        if self.status == 'pending' and old_status != 'pending':
            # Check if an open follow-up task for this grant already exists
            # to prevent duplicates if status flips multiple times.
            existing_task_query = Task.objects.filter(
                grant=self,
                is_grant_follow_up_task=True
            ).exclude(status='completed')

            if not existing_task_query.exists():
                task_title = f"Follow up: Grant '{self.organization_name}' is pending"
                task_description = (
                    f"The grant application for '{self.organization_name}' (ID: {self.id}) "
                    f"has been marked as 'pending' on {timezone.now().strftime('%Y-%m-%d %H:%M')}. "
                    f"Please review and take necessary actions."
                )
                task_assignee = self.submitted_by if self.submitted_by else None
                task_creator = self.submitted_by if self.submitted_by else None
                
                Task.objects.create(
                    title=task_title,
                    description=task_description,
                    assigned_to=task_assignee,
                    assigned_by=task_creator, 
                    status='todo',
                    priority='medium', 
                    due_date=self.application_deadline, 
                    grant=self,
                    is_grant_follow_up_task=True
                )

        # 2. Task Completion: When grant moves from 'pending' to another status
        elif old_status == 'pending' and self.status != 'pending':
            tasks_to_complete = Task.objects.filter(
                grant=self,
                is_grant_follow_up_task=True,
            ).exclude(status='completed') # Only act on tasks that are not already completed
            
            for task_item in tasks_to_complete:
                task_item.status = 'completed'
                task_item.description = (
                    f"{task_item.description}\n\n"
                    f"This task was automatically marked as completed on {timezone.now().strftime('%Y-%m-%d %H:%M')} "
                    f"because the linked grant '{self.organization_name}' (ID: {self.id}) status changed "
                    f"from 'pending' to '{self.get_status_display()}'."
                )
                task_item.save(update_fields=['status', 'description', 'updated_at'])

    def __str__(self):
        return f"{self.organization_name} – {self.amount_currency}{self.amount_value}"


class GrantExpenditure(SoftDeleteModel):
    grant = models.OneToOneField(Grant, on_delete=models.CASCADE, related_name='expenditure')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount_used = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    estimated_depletion_date = models.DateField(null=True, blank=True)

    def usage_percent(self):
        if self.grant.amount_value > 0:
            return (self.amount_used / self.grant.amount_value) * 100
        return 0

    def __str__(self):
        return f"Expenditure for {self.grant.organization_name} – {self.usage_percent():.2f}% used"
