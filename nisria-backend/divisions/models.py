from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError
from decimal import Decimal
from accounts.models import User
from cloudinary.models import CloudinaryField
from core.models import SoftDeleteModel
import uuid

GENDER_CHOICES = [
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other'),
    ('prefer_not_to_say', 'Prefer not to say'),
]

#for the program details
class AuditableModel(SoftDeleteModel):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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

class Division(SoftDeleteModel):
    NAME_FIELD_CHOICES = [
        ("nisria", "Nisria"), 
        ("maisha", "Maisha")
    ]
    name = models.CharField(max_length=100, choices=NAME_FIELD_CHOICES, unique=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description = models.TextField()
    annual_budget = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0.00,
        help_text="Annual budget for this division"
    )
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
    
class Program(SoftDeleteModel):
    PROGRAM_FIELD_CHOICES = [
        ("education", "Education"), 
        ("microfund", "Microfund"),
        ("rescue", "Rescue"),
        ("vocational", "Vocational")
    ]
    name = models.CharField(max_length=100, choices=PROGRAM_FIELD_CHOICES, unique=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
    school = models.CharField(max_length=255, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    grade = models.CharField(max_length=100, blank=True, null=True) # e.g., "Grade 5", "Form 2"
    start_year = models.IntegerField(blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    guardian_relationship = models.CharField(max_length=100, blank=True, null=True) # e.g., "Mother", "Uncle"
    guardian_contact = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    medical_status = models.TextField(blank=True, null=True)
    other_support_details = models.TextField(blank=True, null=True, help_text="Support from sources other than this program.")
    pictures = CloudinaryField('education_pictures', folder='education_program_pictures', null=True, blank=True)
    background = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"Education: {self.student_name} (Program: {self.program.id})"

class MicroFundProgramDetail(AuditableModel):
    ROLE_CHOICES = [
        ('chairperson', 'Chairperson'),
        ('member', 'Member'),
    ]
    
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    person_name = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    chama_group = models.CharField(max_length=255)
    age = models.IntegerField(blank=True, null=True)
    story = models.TextField(blank=True, null=True)
    role_in_group = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='member',
        help_text="Member's role in the chama group"
    )
    money_received = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    project_done = models.TextField(blank=True, null=True)
    progress_notes = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    background = models.TextField(blank=True, null=True)
    pictures = CloudinaryField('microfund_pictures', folder='microfund_program_pictures', null=True, blank=True)
    site_visit_notes = models.TextField(blank=True, null=True, help_text="Record of dates and notes from site visits.")
    testimonials = models.TextField(blank=True, null=True)
    additional_support = models.TextField(blank=True, null=True, help_text="Details of any additional support received apart from this program.")
    is_active = models.BooleanField(default=True)
    location = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)

    def __str__(self):
        return f"MicroFund: {self.person_name} - {self.chama_group} (Program: {self.program.id})"

class RescueProgramDetail(AuditableModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    CASE_TYPE_CHOICES = [
        ('lost_and_found', 'Lost and Found'),
        ('other', 'Other'),
    ]

    # Child's Details
    child_name = models.CharField(max_length=255, unique=True)
    age = models.IntegerField(help_text="Age or predicted age")
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    pictures = CloudinaryField('rescue_child_pictures', folder='rescue_child_pictures', null=True, blank=True)
    
    # Rescue Details
    date_of_rescue = models.DateField(null=True, blank=True)
    location_of_rescue = models.CharField(max_length=255, default='')
    background = models.TextField(help_text="A short background of the child’s situation before rescue", default='')

    # Case Referral
    case_referral_description = models.TextField(null=True, blank=True)
    case_referred_from = models.CharField(max_length=255, default='')
    case_type = models.CharField(max_length=50, choices=CASE_TYPE_CHOICES, default='other')
    case_type_other = models.CharField(max_length=255, null=True, blank=True, help_text="Specify if case type is 'Other'")
    ob_number = models.CharField(max_length=100, null=True, blank=True)
    children_office_case_number = models.CharField(max_length=100, null=True, blank=True)

    # Guardian / Parent Details
    guardian_name = models.CharField(max_length=255, null=True, blank=True)
    guardian_phone_number = models.CharField(max_length=20, null=True, blank=True)
    guardian_residence = models.CharField(max_length=255, null=True, blank=True, help_text="Original residence or location of parents/guardian")

    # Post-Rescue Details
    post_rescue_description = models.TextField(null=True, blank=True)
    urgent_needs = models.TextField(default='')
    educational_background = models.TextField(default='')
    health_status = models.TextField(default='')
    medical_support_details = models.TextField(null=True, blank=True, help_text="Details of medical support received since rescue", default='')
    family_reunification_efforts = models.TextField(default='')
    date_of_exit = models.DateField(null=True, blank=True)

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
    POST_TRAINING_CHOICES = [
        ('self_employed', 'Self-Employed'),
        ('employed', 'Employed'),
        ('further_education', 'Further Education'),
        ('unemployed', 'Unemployed'),
        ('unknown', 'Unknown'),
    ]
    
    class Meta:
        ordering = ['-created_at']
        
    trainee_name = models.CharField(max_length=255, unique=True)
    age = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    trainee_phone = models.CharField(max_length=20)
    trainee_email = models.EmailField()
    address = models.CharField(max_length=255, blank=True, null=True)
    training_received = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    background = models.TextField(blank=True, null=True)
    additional_support = models.TextField(blank=True, null=True, help_text="Support from sources other than this program.")
    post_training_status = models.CharField(max_length=50, choices=POST_TRAINING_CHOICES, blank=True, null=True)
    quarterly_follow_up = models.TextField(blank=True, null=True, help_text="Notes from quarterly follow-ups.")
    testimonial = models.TextField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact_number = models.CharField(max_length=20, blank=True, null=True)
    pictures = CloudinaryField('vocational_trainee_pictures', folder='vocational_trainee_pictures', null=True, blank=True)

    def __str__(self):
        return f"Vocational Trainee: {self.trainee_name} (Trainer: {self.trainer.trainer_name})"