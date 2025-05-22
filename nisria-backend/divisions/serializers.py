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
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = EducationProgramDetail
        fields = [
            'id', 'program', 'program_id', 'student_name', 'gender', 
            'education_level', 'student_location', 'student_contact',
            'start_date', 'end_date', 'school_associated', 
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]

class MicroFundProgramDetailSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(read_only=True, slug_field='name')
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.filter(name="microfund"), source='program', write_only=True, label="Program ID")
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = MicroFundProgramDetail
        fields = [
            'id', 'program', 'program_id', 'person_name', 'gender', 'chama_group', 
            'is_active', 'start_date', 'location', 'telephone',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]

class RescueProgramDetailSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(read_only=True, slug_field='name')
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.filter(name="rescue"), source='program', write_only=True, label="Program ID")
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, allow_blank=True, allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = RescueProgramDetail
        fields = [
            'id', 'program', 'program_id', 'child_name', 'gender', 'is_reunited', 
            'under_care', 'date_joined', 'date_reunited', 'age', 'place_found', 
            'rescuer_contact', 'notes',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]


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
    created_by_username = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = VocationalTrainingProgramTraineeDetail
        fields = [
            'id', 'trainer', 'trainer_name', 'trainee_name', 'gender', 
            'trainee_phone', 'trainee_email', 'trainee_association',
            'date_enrolled', 'under_training',
            'created_at', 'updated_at', 'created_by_username', 'updated_by_username'
        ]
