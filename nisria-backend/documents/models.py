from django.db import models

class Document(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('bank_statement', 'Bank Statement'),
        ('cbo_cert', 'CBO Certificate'),
        ('ngo_cert', 'NGO Certificate'),
        ('impact_report', 'Impact Report'),
        ('pitch_deck', 'Pitch Deck'),
        ('monthly_budget_nisira', 'Monthly Budget (Nisira)'),
        ('monthly_budget_maisha', 'Monthly Budget (Maisha)'),
        ('yearly_budget_nisira', 'Yearly Budget (Nisira)'),
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

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    document_format = models.CharField(max_length=20, choices=DOCUMENT_FORMAT_CHOICES)
    document_link = models.URLField()
    division = models.CharField(max_length=20, choices=DIVISION_CHOICES)

    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_document_type_display()})"