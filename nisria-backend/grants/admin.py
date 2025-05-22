from django.contrib import admin
from .models import Grant, GrantExpenditure

@admin.register(Grant)
class GrantAdmin(admin.ModelAdmin):
    list_display = (
        'organization_name',
        'amount_value',
        'amount_currency',
        'status',
        'application_deadline',
        'program',  # Display the associated program
        'submitted_by',
        'date_created'
    )
    list_filter = ('status', 'organization_type', 'application_deadline', 'program') # Filter by program
    search_fields = ('organization_name', 'notes', 'program__name') # Search by program name
    raw_id_fields = ('submitted_by', 'program', 'required_documents', 'submitted_documents')
    date_hierarchy = 'date_created'
    ordering = ('-date_created',)

@admin.register(GrantExpenditure)
class GrantExpenditureAdmin(admin.ModelAdmin):
    list_display = ('grant_organization_name', 'amount_used', 'formatted_usage_percent', 'estimated_depletion_date')
    list_filter = ('grant__status', 'grant__program') # Example: filter expenditures by grant's program
    search_fields = ('grant__organization_name',)
    raw_id_fields = ('grant',)

    def grant_organization_name(self, obj):
        return obj.grant.organization_name
    grant_organization_name.short_description = 'Grant Organization'

    def formatted_usage_percent(self, obj):
        return f"{obj.usage_percent():.2f}%"
    formatted_usage_percent.short_description = 'Usage %'
