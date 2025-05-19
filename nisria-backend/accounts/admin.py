from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'full_name', 'phone_number')
    ordering = ('-date_joined',)

    # Define fieldsets for the add and change forms
    # These are based on your User model fields, excluding 'username', 'first_name', 'last_name'
    # and including your custom fields.
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'phone_number', 'profile_picture', 'location')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'date_updated')}),
        ('Role', {'fields': ('role',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'phone_number', 'role', 'password', 'password2'),
        }),
    )
    
    # Make date_updated readonly as it's auto-updated
    readonly_fields = ('last_login', 'date_joined', 'date_updated')

    # Since 'username' is None, we don't need it in filter_horizontal
    filter_horizontal = ('groups', 'user_permissions',)

    # If you have custom forms for adding/changing users, specify them here
    # form = UserChangeForm
    # add_form = UserCreationForm

    # Ensure that the custom manager is used
    def get_queryset(self, request):
        return super().get_queryset(request)