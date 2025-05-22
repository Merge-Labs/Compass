from django.db import models
from django.contrib.auth import get_user_model
from documents.models import Document  
from divisions.models import Program

User = get_user_model()


class Grant(models.Model):
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
        is_new = self.pk is None
        old_status_for_comparison = None

        if not is_new:
            # For an existing instance, get its current status from the database
            try:
                old_grant = Grant.objects.get(pk=self.pk)
                old_status_for_comparison = old_grant.status
            except Grant.DoesNotExist:
                # Should not happen if self.pk is valid, but as a fallback,
                # treat as if it's transitioning from the default status.
                old_status_for_comparison = self._meta.get_field('status').get_default()
        else:
            # For a new instance, the "previous" status is its default value
            old_status_for_comparison = self._meta.get_field('status').get_default()

        # The status that is about to be saved (or is currently set on the instance)
        new_status = self.status

        super().save(*args, **kwargs)  # Call the "real" save() method.

        if new_status == 'approved' and old_status_for_comparison == 'pending':
            GrantExpenditure.objects.get_or_create(grant=self)

    def __str__(self):
        return f"{self.organization_name} – {self.amount_currency}{self.amount_value}"


class GrantExpenditure(models.Model):
    grant = models.OneToOneField(Grant, on_delete=models.CASCADE, related_name='expenditure')
    amount_used = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    estimated_depletion_date = models.DateField(null=True, blank=True)

    def usage_percent(self):
        if self.grant.amount_value > 0:
            return (self.amount_used / self.grant.amount_value) * 100
        return 0

    def __str__(self):
        return f"Expenditure for {self.grant.organization_name} – {self.usage_percent():.2f}% used"
