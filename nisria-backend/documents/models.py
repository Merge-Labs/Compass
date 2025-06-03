from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid
from datetime import timedelta
from core.models import SoftDeleteModel

User = get_user_model()

class Document(SoftDeleteModel):
    DOCUMENT_TYPE_CHOICES = [
        ('bank_statement', 'Bank Statement'),
        ('cbo_cert', 'CBO Certificate'),
        ('ngo_cert', 'NGO Certificate'),
        ('impact_report', 'Impact Report'),
        ('pitch_deck', 'Pitch Deck'),
        ('monthly_budget_nisria', 'Monthly Budget (Nisria)'),
        ('monthly_budget_maisha', 'Monthly Budget (Maisha)'),
        ('yearly_budget_nisria', 'Yearly Budget (Nisria)'),
        ('yearly_budget_maisha', 'Yearly Budget (Maisha)'),
        ('overall_budget', 'Overall Budget'),
    ]

    DOCUMENT_FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('docx', 'DOCX'),
        ('canva', 'Canva'),
        ('pptx', 'PPTX'),
        ('jpg', 'JPG'),
        ('png', 'PNG'),
    ]

    DIVISION_CHOICES = [
        ('overall', 'Overall'),
        ('nisira', 'Nisria'),
        ('maisha', 'Maisha'),
    ]

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    document_format = models.CharField(max_length=20, choices=DOCUMENT_FORMAT_CHOICES)
    document_link = models.URLField()
    division = models.CharField(max_length=20, choices=DIVISION_CHOICES)
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_document_type_display()})"

class BankStatementAccessRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, limit_choices_to={'document_type': 'bank_statement'})
    pin = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_granted = models.BooleanField(default=False)

    def is_valid(self):
        return self.created_at >= timezone.now() - timedelta(minutes=2) and self.is_granted
