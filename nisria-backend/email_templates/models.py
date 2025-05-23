from django.db import models
from django.conf import settings
import uuid
class EmailTemplates(models.Model):
    TEMPLATE_TYPE_CHOICES = [
        ('grant_application', 'Grant Application'),
        ('partnership_appeal', 'Partnership Appeal'),
        ('service_provision_contract', "Service Provision Contract"),
        ('program_application', 'Program Application'),
        ('impact_Update_to_donors', 'Impact Update to Donors'),
        ('employee_contract', 'Employee Contract'),
        ('concept_note', 'Concept Note'),
    ]

    name = models.CharField(max_length=100)  
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPE_CHOICES)
    subject_template = models.CharField(max_length=255)
    body_template = models.TextField(help_text="Use {{placeholders}} for dynamic fields.")

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_email_templates',
        on_delete=models.SET_NULL, 
        null=True,
        blank=True, # Allows the field to be blank in forms/admin, though editable=False makes this less relevant for direct input
        editable=False, # This field should be set programmatically
        help_text="User who created this template."
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='updated_email_templates',
        on_delete=models.SET_NULL, # Or models.PROTECT
        null=True,
        blank=True,
        editable=False, # This field should be set programmatically
        help_text="User who last updated this template."
    )
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name