from rest_framework import serializers
from .models import Division, EducationProgram, MicroFundProgram, RescueProgram, VocationalTrainingProgram
from accounts.models import User

class DivisionSerializer(serializers.ModelSerializer):
    lead = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='management_lead'),
        allow_null=True,
        required=False  # Allow lead to be optional
    )
    total_budget = serializers.ReadOnlyField()

    class Meta:
        model = Division
        fields = ['id', 'name', 'description', 'lead', 'date_created', 'date_updated', 'total_budget']


# FIXME: the programs and instances of the programs must be different based on this fix the serializers
class BaseProgramSerializer(serializers.ModelSerializer):
    division = serializers.PrimaryKeyRelatedField(read_only=True)
    maintainer = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['grant_officer', 'management_lead', 'admin']),
        allow_null=True,
        required=False # Allow maintainer to be optional
    )
    # Division is typically set by the view based on URL, so it might be read-only or excluded here
    # If it needs to be writable, ensure it's handled correctly in view's perform_create
    division = serializers.PrimaryKeyRelatedField(read_only=True) # Or queryset=Division.objects.all() if writable

    class Meta:
        # 'model' attribute will be set in subclasses
        # Common fields can be listed here if any, but most are in Program model itself
        fields = [
            'id', 'name', 'description', 'division', 'monthly_budget', 'annual_budget',
            'maintainer', 'date_created', 'date_updated'
        ]


class EducationProgramSerializer(BaseProgramSerializer):
    class Meta(BaseProgramSerializer.Meta):
        model = EducationProgram
        fields = BaseProgramSerializer.Meta.fields + [
            'student_name', 'education_level', 'student_location', 'student_contact',
            'start_date', 'end_date', 'school_associated'
        ]


class MicroFundProgramSerializer(BaseProgramSerializer):
    class Meta(BaseProgramSerializer.Meta):
        model = MicroFundProgram
        fields = BaseProgramSerializer.Meta.fields + [
            'person_name', 'chama_group', 'is_active', 'start_date', 'location', 'telephone'
        ]


class RescueProgramSerializer(BaseProgramSerializer):
    class Meta(BaseProgramSerializer.Meta):
        model = RescueProgram
        fields = BaseProgramSerializer.Meta.fields + [
            'child_name', 'is_reunited', 'under_care', 'date_joined', 'date_reunited',
            'age', 'place_found', 'rescuer_contact', 'notes'
        ]


class VocationalTrainingProgramSerializer(BaseProgramSerializer):
    class Meta(BaseProgramSerializer.Meta):
        model = VocationalTrainingProgram
        fields = BaseProgramSerializer.Meta.fields + [
            'trainer_name', 'trainer_association', 'trainer_phone', 'trainer_email',
            'trainee_name', 'trainee_phone', 'trainee_email', 'trainee_association',
            'date_enrolled', 'under_training'
        ]

    def validate(self, data):
        # Example custom validation: ensure trainer and trainee are not the same if needed
        # if data.get('trainer_email') == data.get('trainee_email'):
        #     raise serializers.ValidationError("Trainer and Trainee email cannot be the same.")
        return data