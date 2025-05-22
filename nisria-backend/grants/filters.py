import django_filters
from django.utils import timezone
from .models import Grant, GrantExpenditure
from divisions.models import Program 

class GrantFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')
    organization_name = django_filters.CharFilter(field_name='organization_name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')

    deadline_before = django_filters.DateFilter(field_name='application_deadline', lookup_expr='lte')
    deadline_after = django_filters.DateFilter(field_name='application_deadline', lookup_expr='gte')

    expiring_soon = django_filters.BooleanFilter(method='filter_expiring_soon')
    program = django_filters.ModelChoiceFilter(queryset=Program.objects.all())

    def filter_expiring_soon(self, queryset, name, value):
        if value:
            today = timezone.now().date()
            next_week = today + timezone.timedelta(days=7)
            return queryset.filter(application_deadline__range=(today, next_week))
        return queryset

    class Meta:
        model = Grant
        fields = [
            'status',
            'organization_name',
            'location',
            'deadline_before',
            'deadline_after',
            'expiring_soon',
            'program',
        ]

class GrantExpenditureFilter(django_filters.FilterSet):
    grant_organization_name = django_filters.CharFilter(
        field_name='grant__organization_name', lookup_expr='icontains',
        label='Grant Organization Name'
    )
    grant_status = django_filters.ChoiceFilter(
        field_name='grant__status', choices=Grant.STATUS_CHOICES,
        label='Grant Status'
    )
    min_amount_used = django_filters.NumberFilter(
        field_name='amount_used', lookup_expr='gte',
        label='Min Amount Used'
    )
    max_amount_used = django_filters.NumberFilter(
        field_name='amount_used', lookup_expr='lte',
        label='Max Amount Used'
    )
    depletion_date_before = django_filters.DateFilter(
        field_name='estimated_depletion_date', lookup_expr='lte',
        label='Depletion Date Before'
    )
    depletion_date_after = django_filters.DateFilter(
        field_name='estimated_depletion_date', lookup_expr='gte',
        label='Depletion Date After'
    )
    grant_program = django_filters.ModelChoiceFilter(
        field_name='grant__program',
        queryset=Program.objects.all(),
        label='Grant Program'
    )

    class Meta:
        model = GrantExpenditure
        fields = [
            'grant_organization_name',
            'grant_status',
            'grant_program',
            'min_amount_used',
            'max_amount_used',
            'depletion_date_before',
            'depletion_date_after',
        ]