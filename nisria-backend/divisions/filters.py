import django_filters
from .models import EducationProgram, MicroFundProgram, RescueProgram, VocationalTrainingProgram


class BaseProgramFilter(django_filters.FilterSet):
    # Common filter fields can be defined here if needed
    # For example, if 'maintainer' was a CharFilter for name instead of ID:
    # maintainer_name = django_filters.CharFilter(field_name='maintainer__username', lookup_expr='icontains')
    pass


class EducationProgramFilter(BaseProgramFilter):
    class Meta:
        model = EducationProgram
        fields = {
            'maintainer': ['exact'], # Assumes you want to filter by maintainer ID
            'education_level': ['exact', 'icontains'],
            'student_location': ['exact', 'icontains'],
            'school_associated': ['exact', 'icontains'],
            # Add more fields as needed, e.g., date ranges
            # 'start_date': ['gte', 'lte'],
        }


class MicroFundProgramFilter(BaseProgramFilter):
    class Meta:
        model = MicroFundProgram
        fields = {
            'maintainer': ['exact'],
            'is_active': ['exact'],
            'location': ['exact', 'icontains'],
            'chama_group': ['exact', 'icontains'],
        }


class RescueProgramFilter(BaseProgramFilter):
    class Meta:
        model = RescueProgram
        fields = {
            'maintainer': ['exact'],
            'is_reunited': ['exact'],
            'under_care': ['exact'],
            'place_found': ['exact', 'icontains'],
        }

class VocationalTrainingProgramFilter(BaseProgramFilter):
    class Meta:
        model = VocationalTrainingProgram
        fields = {
            'maintainer': ['exact'],
            'trainer_association': ['exact', 'icontains'],
            'trainee_association': ['exact', 'icontains'],
            'under_training': ['exact'],
        }