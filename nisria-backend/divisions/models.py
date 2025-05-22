from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError
from decimal import Decimal
from accounts.models import User

GENDER_CHOICES = [
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other'),
    ('prefer_not_to_say', 'Prefer not to say'),
]

#for the program details
class AuditableModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='%(app_label)s_%(class)s_created_by',
        editable=False
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='%(app_label)s_%(class)s_updated_by'
    )

    class Meta:
        abstract = True

class Division(models.Model):
    NAME_FIELD_CHOICES = [
        ("nisria", "Nisria"), 
        ("maisha", "Maisha")
    ]
    name = models.CharField(max_length=100, choices=NAME_FIELD_CHOICES, unique=True)
    description=models.TextField()
    leads = models.ManyToManyField(
        User, 
        limit_choices_to={'role__in': ['management_lead', "super_admin"]}, 
        blank=True,
        related_name="led_divisions"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    @property
    def total_budget(self):
        """Calculates the total annual budget from all programs under this division."""
        aggregation = self.program_set.aggregate(total_annual_budget=Sum('annual_budget'))
        return aggregation['total_annual_budget'] or Decimal('0.00')

    def __str__(self):
        return f"{self.name} - {self.description}"
    
class Program(models.Model):
    PROGRAM_FIELD_CHOICES = [
        ("education", "Education"), 
        ("microfund", "Microfund"),
        ("rescue", "Rescue"),
        ("vocational", "Vocational")
    ]
    name = models.CharField(max_length=100, choices=PROGRAM_FIELD_CHOICES, unique=True)
    description=models.TextField()
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2)
    annual_budget = models.DecimalField(max_digits=10, decimal_places=2)
    maintainers = models.ManyToManyField(
        User, 
        limit_choices_to={'role__in': ['grant_officer', 'management_lead', 'admin', "super_admin"]}, 
        blank=True,
        related_name="maintained_programs"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        if self.division and self.name:
            nisria_programs = ["education", "microfund", "rescue"]
            maisha_programs = ["vocational"]

            if self.name in nisria_programs and self.division.name != "nisria":
                raise ValidationError(
                    f"Program '{self.get_name_display()}' must be under the 'Nisria' division."
                )
            if self.name in maisha_programs and self.division.name != "maisha":
                raise ValidationError(
                    f"Program '{self.get_name_display()}' must be under the 'Maisha' division."
                )

    def __str__(self):
        return f"{self.get_name_display()} Program in {self.division.get_name_display()} Division"

class EducationProgramDetail(AuditableModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    student_name = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    education_level = models.CharField(max_length=255)
    student_location = models.CharField(max_length=255)
    student_contact = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    school_associated = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Education: {self.student_name} (Program: {self.program.id})"

class MicroFundProgramDetail(AuditableModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    person_name = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    chama_group = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField()
    location = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)

    def __str__(self):
        return f"MicroFund: {self.person_name} - {self.chama_group} (Program: {self.program.id})"

class RescueProgramDetail(AuditableModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    child_name = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    is_reunited = models.BooleanField(default=False)
    under_care = models.BooleanField(default=True)
    date_joined = models.DateField()
    date_reunited = models.DateField(null=True, blank=True)
    age = models.IntegerField()
    place_found = models.CharField(max_length=255)
    rescuer_contact = models.CharField(max_length=20, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Rescue: {self.child_name} (Program: {self.program.id})"
    

class VocationalTrainingProgramTrainerDetail(AuditableModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    trainer_name = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    trainer_association = models.CharField(max_length=255)
    trainer_phone = models.CharField(max_length=20)
    trainer_email = models.EmailField()

    def __str__(self):
        return f"Vocational Trainer: {self.trainer_name} (Program: {self.program.id})"


class VocationalTrainingProgramTraineeDetail(AuditableModel):
    trainer = models.ForeignKey(VocationalTrainingProgramTrainerDetail, on_delete=models.CASCADE)
    trainee_name = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    trainee_phone = models.CharField(max_length=20)
    trainee_email = models.EmailField()
    trainee_association = models.CharField(max_length=255)
    date_enrolled = models.DateField()
    under_training = models.BooleanField(default=True)

    def __str__(self):
        return f"Vocational Trainee: {self.trainee_name} (Trainer: {self.trainer.trainer_name})"