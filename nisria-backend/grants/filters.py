import django_filters
from django.utils import timezone
from .models import Grant

class GrantFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')
    organization_name = django_filters.CharFilter(field_name='organization_name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')

    deadline_before = django_filters.DateFilter(field_name='application_deadline', lookup_expr='lte')
    deadline_after = django_filters.DateFilter(field_name='application_deadline', lookup_expr='gte')

    expiring_soon = django_filters.BooleanFilter(method='filter_expiring_soon')

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
        ]
