import django_filters
from .models import Document

class DocumentFilter(django_filters.FilterSet):
    document_type = django_filters.CharFilter(field_name='document_type', lookup_expr='iexact')
    document_format = django_filters.CharFilter(field_name='document_format', lookup_expr='iexact')
    division = django_filters.CharFilter(field_name='division', lookup_expr='iexact')
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')  # for search

    class Meta:
        model = Document
        fields = ['document_type', 'document_format', 'division', 'name']
