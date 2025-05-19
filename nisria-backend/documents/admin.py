from django.contrib import admin
from .models import Document, BankStatementAccessRequest

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'document_type', 'document_format', 'division', 'date_uploaded')
    list_filter = ('document_type', 'document_format', 'division', 'date_uploaded')
    search_fields = ('name', 'description', 'document_link')
    ordering = ('-date_uploaded',)

@admin.register(BankStatementAccessRequest)
class BankStatementAccessRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'document', 'pin', 'is_granted', 'created_at', 'is_valid_display')
    list_filter = ('is_granted', 'created_at')
    search_fields = ('user__username', 'document__name', 'pin')
    readonly_fields = ('pin', 'created_at')

    def is_valid_display(self, obj):
        return obj.is_valid()
    is_valid_display.short_description = 'Is Valid'
    is_valid_display.boolean = True
