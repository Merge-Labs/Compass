import uuid
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.core.exceptions import ValidationError  
from cloudinary.models import CloudinaryField # Import CloudinaryField
 
class UserManager(BaseUserManager):
    def create_user(self, email, full_name, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)        
        # Ensure 'is_staff' and 'is_superuser' are not passed directly if role is used to set them
        User = self.model(email=email, full_name=full_name, phone_number=phone_number, **extra_fields)
        User.set_password(password)
        User.save(using=self._db)
        return User
        
    def create_superuser(self, email, full_name, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, full_name, phone_number, password, **extra_fields)


class User(AbstractUser):
    """
    Custom user model for the application.
    """

    # Override the id field to use UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('management_lead', 'Management Lead'),
        ('grant_officer', 'Grant Officer'),
    ]

    # Remove username, first_name, and last_name fields from AbstractUser
    username = None
    first_name = None
    last_name = None
    
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_picture = CloudinaryField(
        'profile_picture',  # Optional: name of the folder in Cloudinary
        folder='profile_pics', # Explicitly set the folder in Cloudinary
        null=True, blank=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'role']

    def save(self, *args, **kwargs):  
        if not self.email.endswith('@nisria.co'):
            raise ValidationError('Email must end with @nisria.co')

        # Roles that should have staff access to the admin panel
        staff_roles = ['super_admin', 'admin', 'management_lead'] 
        if self.role in staff_roles:
            self.is_staff = True
        # elif not self.is_superuser: # Optional: ensure other roles are not staff unless they are superuser
        #     self.is_staff = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {self.role}"  # Corrected field reference
    
# TODO: Email Validation with OTP
