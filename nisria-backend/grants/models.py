from django.db import models
from django.contrib.auth import get_user_model
from documents.models import Document  # assuming this is from another app

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

    # Removed focus_area, division, and project
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
