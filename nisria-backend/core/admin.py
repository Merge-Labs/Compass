from django.contrib import admin
from .models import RecycleBinItem

@admin.register(RecycleBinItem)
class RecycleBinItemAdmin(admin.ModelAdmin):
    list_display = ('content_type', 'actual_object_id', 'deleted_at', 'deleted_by', 'expires_at', 'restored_at')
    search_fields = ('object_id_int', 'object_id_uuid', 'deleted_by__username')
    list_filter = ('content_type', 'deleted_at', 'expires_at', 'restored_at')
    readonly_fields = ('original_data',)