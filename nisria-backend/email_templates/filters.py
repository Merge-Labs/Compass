import django_filters
from .models import EmailTemplates
from django.conf import settings # To reference the User model

class EmailTemplateFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains') 
    template_type = django_filters.ChoiceFilter(choices=EmailTemplates.TEMPLATE_TYPE_CHOICES)

    # Date range filters
    date_created_after = django_filters.DateFilter(field_name='date_created', lookup_expr='gte')
    date_created_before = django_filters.DateFilter(field_name='date_created', lookup_expr='lte')
    # Alternatively, for a single parameter for date range:
    # date_created_range = django_filters.DateFromToRangeFilter(field_name='date_created')

    last_updated_after = django_filters.DateFilter(field_name='last_updated', lookup_expr='gte')
    last_updated_before = django_filters.DateFilter(field_name='last_updated', lookup_expr='lte')
    # last_updated_range = django_filters.DateFromToRangeFilter(field_name='last_updated')

    # Filter by the 'full_name' of the user who created/updated the template.
    created_by_name = django_filters.CharFilter(field_name='created_by__full_name', lookup_expr='icontains')
    updated_by_name = django_filters.CharFilter(field_name='updated_by__full_name', lookup_expr='icontains')

    class Meta:
        model = EmailTemplates
        # Note: 'created_by' and 'updated_by' (the ForeignKey fields themselves) are removed from this list
        # as we are now explicitly defining filters for their related 'username' fields.
        # You can still filter by user ID if you keep the ModelChoiceFilter or add another filter for it.
        fields = ['template_type', 'name', 'created_by_name', 'updated_by_name', 'date_created_after', 'date_created_before', 'last_updated_after', 'last_updated_before']
        # If using DateFromToRangeFilter, you'd list 'date_created_range' and 'last_updated_range' here instead of the _after/_before fields.