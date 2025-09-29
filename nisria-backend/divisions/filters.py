import django_filters
from .models import (
    Division, Program,
    EducationProgramDetail, MicroFundProgramDetail, RescueProgramDetail,
    VocationalTrainingProgramTrainerDetail, VocationalTrainingProgramTraineeDetail,
    GENDER_CHOICES 
)


class DivisionFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    leads = django_filters.ModelMultipleChoiceFilter(field_name='leads', queryset=Program._meta.get_field('maintainers').related_model.objects.all())

    class Meta:
        model = Division
        fields = ['name', 'leads']


class ProgramFilter(django_filters.FilterSet):
    name = django_filters.ChoiceFilter(choices=Program.PROGRAM_FIELD_CHOICES)
    division = django_filters.ModelChoiceFilter(queryset=Division.objects.all())
    maintainers = django_filters.ModelMultipleChoiceFilter(queryset=Program._meta.get_field('maintainers').related_model.objects.all()) # Uses User model
    monthly_budget_gte = django_filters.NumberFilter(field_name='monthly_budget', lookup_expr='gte')
    monthly_budget_lte = django_filters.NumberFilter(field_name='monthly_budget', lookup_expr='lte')
    annual_budget_gte = django_filters.NumberFilter(field_name='annual_budget', lookup_expr='gte')
    annual_budget_lte = django_filters.NumberFilter(field_name='annual_budget', lookup_expr='lte')

    class Meta:
        model = Program
        fields = [
            'name', 'division', 'maintainers',
            'monthly_budget_gte', 'monthly_budget_lte',
            'annual_budget_gte', 'annual_budget_lte'
        ]


class EducationProgramDetailFilter(django_filters.FilterSet):
    program = django_filters.ModelChoiceFilter(queryset=Program.objects.filter(name="education"))
    program__division = django_filters.ModelChoiceFilter(field_name='program__division', queryset=Division.objects.all())
    student_name = django_filters.CharFilter(lookup_expr='icontains')
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES)
    start_year = django_filters.NumberFilter()
    graduation_year = django_filters.NumberFilter()

    class Meta:
        model = EducationProgramDetail
        fields = {
            'program': ['exact'],
            'program__division': ['exact'],
            'student_name': ['icontains'],
            'gender': ['exact'],
            'school': ['exact', 'icontains'],
            'grade': ['exact', 'icontains'],
            'address': ['exact', 'icontains'],
            'start_year': ['exact', 'gte', 'lte'],
            'graduation_year': ['exact', 'gte', 'lte'],
        }


class MicroFundProgramDetailFilter(django_filters.FilterSet):
    program = django_filters.ModelChoiceFilter(queryset=Program.objects.filter(name="microfund"))
    program__division = django_filters.ModelChoiceFilter(field_name='program__division', queryset=Division.objects.all())
    person_name = django_filters.CharFilter(lookup_expr='icontains')
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES)

    class Meta:
        model = MicroFundProgramDetail
        fields = {
            'program': ['exact'],
            'program__division': ['exact'],
            'person_name': ['icontains'],
            'gender': ['exact'],
            'is_active': ['exact'],
            'location': ['exact', 'icontains'],
            'chama_group': ['exact', 'icontains'],
            'role_in_group': ['exact', 'icontains'],
        }


class RescueProgramDetailFilter(django_filters.FilterSet):
    program = django_filters.ModelChoiceFilter(queryset=Program.objects.filter(name="rescue"))
    program__division = django_filters.ModelChoiceFilter(field_name='program__division', queryset=Division.objects.all())
    child_name = django_filters.CharFilter(lookup_expr='icontains')
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES)
    date_of_rescue = django_filters.DateFromToRangeFilter()
    date_of_exit = django_filters.DateFromToRangeFilter()

    class Meta:
        model = RescueProgramDetail
        fields = {
            'program': ['exact'],
            'program__division': ['exact'],
            'child_name': ['icontains'],
            'gender': ['exact'],
            'case_type': ['exact'],
            'location_of_rescue': ['exact', 'icontains'],
            'age': ['exact', 'gte', 'lte'],
            'date_of_rescue': ['exact', 'gte', 'lte'],
            'date_of_exit': ['exact', 'gte', 'lte'],
        }

class VocationalTrainingProgramTrainerDetailFilter(django_filters.FilterSet):
    program = django_filters.ModelChoiceFilter(queryset=Program.objects.filter(name="vocational"))
    program__division = django_filters.ModelChoiceFilter(field_name='program__division', queryset=Division.objects.all())
    trainer_name = django_filters.CharFilter(lookup_expr='icontains')
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES)

    class Meta:
        model = VocationalTrainingProgramTrainerDetail
        fields = {
            'program': ['exact'],
            'program__division': ['exact'],
            'trainer_name': ['icontains'],
            'gender': ['exact'],
            'trainer_association': ['exact', 'icontains'],
            'trainer_email': ['exact', 'icontains'],
        }

class VocationalTrainingProgramTraineeDetailFilter(django_filters.FilterSet):
    trainer = django_filters.ModelChoiceFilter(queryset=VocationalTrainingProgramTrainerDetail.objects.all())
    trainer__program = django_filters.ModelChoiceFilter(field_name='trainer__program', queryset=Program.objects.filter(name="vocational"))
    trainer__program__division = django_filters.ModelChoiceFilter(field_name='trainer__program__division', queryset=Division.objects.all())
    trainee_name = django_filters.CharFilter(lookup_expr='icontains')
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES)
    start_date = django_filters.DateFromToRangeFilter()
    end_date = django_filters.DateFromToRangeFilter()

    class Meta:
        model = VocationalTrainingProgramTraineeDetail
        fields = {
            'trainer': ['exact'],
            'trainer__program': ['exact'], 
            'trainer__program__division': ['exact'], 
            'trainee_name': ['icontains'],
            'gender': ['exact'],
            'training_received': ['exact', 'icontains'],
            'post_training_status': ['exact'],
            'start_date': ['exact', 'gte', 'lte'],
            'end_date': ['exact', 'gte', 'lte'],
        }