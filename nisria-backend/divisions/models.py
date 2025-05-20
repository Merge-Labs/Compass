from django.db import models
from django.db.models import Sum
from decimal import Decimal
from accounts.models import User

class Division(models.Model):
    NAME_FIELD_CHOICES = [
        ("nisria", "Nisria"), 
        ("maisha", "Maisha")
    ]
    name = models.CharField(max_length=100, choices=NAME_FIELD_CHOICES, unique=True)
    description=models.TextField()
    lead = models.ForeignKey(User, limit_choices_to={'role': 'management_lead'}, on_delete=models.SET_NULL, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    # TODO: add the total budget which is the aggregate of the program budgets
    @property
    def total_budget(self):
        total = Decimal('0.00')
        # Assuming 'annual_budget' is the field to sum in program models
        # and related_name from Program's ForeignKey 'division' to Division
        # defaults to 'modelname_set'.

        if hasattr(self, 'educationprogram_set'):
            education_budget = self.educationprogram_set.aggregate(total=Sum('annual_budget'))['total']
            total += education_budget or Decimal('0.00')
        if hasattr(self, 'microfundprogram_set'):
            microfund_budget = self.microfundprogram_set.aggregate(total=Sum('annual_budget'))['total']
            total += microfund_budget or Decimal('0.00')
        if hasattr(self, 'rescueprogram_set'):
            rescue_budget = self.rescueprogram_set.aggregate(total=Sum('annual_budget'))['total']
            total += rescue_budget or Decimal('0.00')
        if hasattr(self, 'vocationaltrainingprogram_set'):
            vocational_budget = self.vocationaltrainingprogram_set.aggregate(total=Sum('annual_budget'))['total']
            total += vocational_budget or Decimal('0.00')

        return total

    def __str__(self):
        return f"{self.name} - {self.description}"
    
# FIXME: the programs and instances of the programs must be different
class Program(models.Model):
    name = models.CharField(max_length=100)
    description=models.TextField()
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2)
    annual_budget = models.DecimalField(max_digits=10, decimal_places=2)
    maintainer = models.ForeignKey(User, limit_choices_to={'role__in': ['grant_officer', 'management_lead', 'admin']}, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class EducationProgram(Program):
    student_name = models.CharField(max_length=255)
    education_level = models.CharField(max_length=255)
    student_location = models.CharField(max_length=255)
    student_contact = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    school_associated = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.student_name}"

class MicroFundProgram(Program):
    person_name = models.CharField(max_length=255)
    chama_group = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField()
    location = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} - {self.chama_group}"

class RescueProgram(Program):
    child_name = models.CharField(max_length=255)
    is_reunited = models.BooleanField(default=False)
    under_care = models.BooleanField(default=True)
    date_joined = models.DateField()
    date_reunited = models.DateField(null=True, blank=True)
    age = models.IntegerField()
    place_found = models.CharField(max_length=255)
    rescuer_contact = models.CharField(max_length=20, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.child_name}"   
    

class VocationalTrainingProgram(Program):
    # Trainer
    trainer_name = models.CharField(max_length=255)
    trainer_association = models.CharField(max_length=255)
    trainer_phone = models.CharField(max_length=20)
    trainer_email = models.EmailField()

    # Trainee
    trainee_name = models.CharField(max_length=255)
    trainee_phone = models.CharField(max_length=20)
    trainee_email = models.EmailField()
    trainee_association = models.CharField(max_length=255)
    date_enrolled = models.DateField()
    under_training = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.trainee_name}"