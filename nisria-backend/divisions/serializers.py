from rest_framework import serializers
from .models import (
    Division, Program,
    EducationProgramDetail, MicroFundProgramDetail, RescueProgramDetail,
    VocationalTrainingProgramTrainerDetail, VocationalTrainingProgramTraineeDetail,
    GENDER_CHOICES 
)
from accounts.models import User
from django.core.exceptions import ValidationError as DjangoValidationError

class DivisionSerializer(serializers.ModelSerializer):
    leads = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['management_lead', 'super_admin']),
        allow_null=True,
        required=False,
        many=True,
        allow_empty=True
    )
    total_budget = serializers.ReadOnlyField() 

    class Meta:
        model = Division
        fields = ['id', 'name', 'description', 'leads', 'date_created', 'date_updated', 'total_budget']


class ProgramSerializer(serializers.ModelSerializer):
    division = serializers.PrimaryKeyRelatedField(
        queryset=Division.objects.all()
    )

    division_name_display = serializers.CharField(source='division.get_name_display', read_only=True)
    maintainers = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['grant_officer', 'management_lead', 'admin', 'super_admin']),
        allow_null=True,
        required=False,
        many=True,
        allow_empty=True
    )

    class Meta:
        model = Program
        fields = [
            'id', 'name', 'description', 
            'division', 
            'division_name_display', 
            'monthly_budget', 'annual_budget', 
            'maintainers', 'date_created', 'date_updated'
        ]

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        name = data.get('name', instance.name if instance else None)
        
        division_from_data = data.get('division')

        final_division_instance = None
        if division_from_data:
            final_division_instance = division_from_data
        elif instance and instance.division: 
            final_division_instance = instance.division
        
        if not name or not final_division_instance:
            return data


        program_display_name = dict(Program.PROGRAM_FIELD_CHOICES).get(name, name)
        nisria_programs = ["education", "microfund", "rescue"]
        maisha_programs = ["vocational"]

        try:
            if name in nisria_programs and final_division_instance.name != "nisria":
                raise DjangoValidationError(
                    f"Program '{program_display_name}' must be under the 'Nisria' division."
                )
            if name in maisha_programs and final_division_instance.name != "maisha":
                raise DjangoValidationError(
                    f"Program '{program_display_name}' must be under the 'Maisha' division."
                )
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else str(e))
            
        return data


class EducationProgramDetailSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(read_only=True, slug_field='name') 
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.filter(name="education"), source='program', write_only=True, label="Program ID")
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    # Explicitly define fields to ensure correct serialization, especially for nullable/special fields
    picture_url = serializers.SerializerMethodField()
    school = serializers.CharField(allow_null=True, required=False)
    background = serializers.CharField(allow_null=True, required=False)
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = EducationProgramDetail
        fields = [
            'id', 'program', 'program_id', 'student_name', 'school', 'age', 
            'grade', 'start_year', 'graduation_year', 'guardian_name', 
            'guardian_relationship', 'guardian_contact', 'address', 'medical_status',
            'other_support_details', 'pictures', 'picture_url', 'background',
            'gender', 'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]
        extra_kwargs = {
            'pictures': {'write_only': True, 'required': False}
        }
    
    def get_picture_url(self, obj):
        """
        Returns the URL of the picture if it exists.
        """
        if obj.pictures and hasattr(obj.pictures, 'url'):
            return obj.pictures.url
        return None

class MicroFundProgramDetailSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(read_only=True, slug_field='name')
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.filter(name="microfund"), source='program', write_only=True, label="Program ID")
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    role_in_group = serializers.ChoiceField(
        choices=MicroFundProgramDetail.ROLE_CHOICES,
        default='member',
        help_text="Member's role in the chama group"
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    picture_url = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make chama_group required only for new instances
        if self.instance is None and 'chama_group' in self.fields:
            self.fields['chama_group'].required = True
        elif 'chama_group' in self.fields:
            self.fields['chama_group'].required = False

    class Meta:
        model = MicroFundProgramDetail
        fields = [
            'id', 'program', 'program_id', 'person_name', 'age', 'gender', 'story',
            'chama_group', 'role_in_group', 'money_received', 'project_done',
            'progress_notes', 'address', 'location', 'telephone', 'background',
            'pictures', 'picture_url', 'site_visit_notes', 'testimonials',
            'additional_support', 'is_active',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]
        extra_kwargs = {
            'pictures': {'write_only': True, 'required': False},
            'chama_group': {'required': False}  # Make optional by default, we'll handle in __init__
        }

    def get_picture_url(self, obj):
        if obj.pictures and hasattr(obj.pictures, 'url'):
            return obj.pictures.url
        return None

class RescueProgramDetailSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(read_only=True, slug_field='name')
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.filter(name="rescue"), source='program', write_only=True, label="Program ID")
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    picture_url = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = RescueProgramDetail
        fields = [
            'id', 'program', 'program_id', 'child_name', 'age', 'date_of_birth', 'gender', 'pictures', 'picture_url',
            'date_of_rescue', 'location_of_rescue', 'background',
            'case_referral_description', 'case_referred_from', 'case_type', 'case_type_other', 
            'ob_number', 'children_office_case_number',
            'guardian_name', 'guardian_phone_number', 'guardian_residence',
            'post_rescue_description', 'urgent_needs', 'educational_background', 'health_status',
            'medical_support_details', 'family_reunification_efforts', 'date_of_exit',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]
        extra_kwargs = {
            'pictures': {'write_only': True, 'required': False}
        }

    def get_picture_url(self, obj):
        if obj.pictures and hasattr(obj.pictures, 'url'):
            return obj.pictures.url
        return None


class VocationalTrainingProgramTrainerDetailSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(read_only=True, slug_field='name')
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.filter(name="vocational"), source='program', write_only=True, label="Program ID")
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = VocationalTrainingProgramTrainerDetail
        fields = [
            'id', 'program', 'program_id', 'trainer_name', 'gender', 
            'trainer_association', 'trainer_phone', 'trainer_email',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]

class VocationalTrainingProgramTraineeDetailSerializer(serializers.ModelSerializer):
    # Trainer is a ForeignKey to VocationalTrainingProgramTrainerDetail
    trainer = serializers.PrimaryKeyRelatedField(queryset=VocationalTrainingProgramTrainerDetail.objects.all())
    trainer_name = serializers.ReadOnlyField(source='trainer.trainer_name') # Include trainer name for readability
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    picture_url = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = VocationalTrainingProgramTraineeDetail
        fields = [
            'id', 'trainer', 'trainer_name', 'trainee_name', 'age', 'gender',
            'trainee_phone', 'trainee_email', 'address', 'training_received',
            'start_date', 'end_date', 'background', 'additional_support',
            'post_training_status', 'quarterly_follow_up', 'testimonial',
            'emergency_contact_name', 'emergency_contact_number', 'pictures', 'picture_url',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]
        extra_kwargs = {
            'pictures': {'write_only': True, 'required': False}
        }

    def get_picture_url(self, obj):
        if obj.pictures and hasattr(obj.pictures, 'url'):
            return obj.pictures.url
        return None
