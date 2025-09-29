from django.contrib import admin
from .models import (
    Division, Program,
    EducationProgramDetail, MicroFundProgramDetail, RescueProgramDetail,
    VocationalTrainingProgramTrainerDetail, VocationalTrainingProgramTraineeDetail
)

@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'date_created', 'date_updated', 'total_budget_display', 'display_leads')
    search_fields = ('name', 'description')
    list_filter = ('name', 'date_created', 'date_updated')
    readonly_fields = ('total_budget_display',)
    filter_horizontal = ('leads',) 

    def total_budget_display(self, obj):
        return obj.total_budget
    total_budget_display.short_description = 'Total Annual Budget'

    def display_leads(self, obj):
        leads_with_usernames = [lead.username for lead in obj.leads.all() if lead and lead.username]
        return ", ".join(leads_with_usernames)
    display_leads.short_description = 'Leads'

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'division', 'annual_budget', 'monthly_budget', 'date_created', 'date_updated', 'display_maintainers')
    list_filter = ('division', 'name', 'date_created')
    search_fields = ('name', 'description', 'division__name')
    readonly_fields = ('date_created', 'date_updated')
    list_select_related = ('division',)
    filter_horizontal = ('maintainers',) 

    def display_maintainers(self, obj):
        maintainers_with_usernames = [user.username for user in obj.maintainers.all() if user and user.username]
        return ", ".join(maintainers_with_usernames)
    display_maintainers.short_description = 'Maintainers'

class BaseProgramDetailAdmin(admin.ModelAdmin):
    list_display = ('program_name', 'gender_display', 'created_at_display', 'created_by_display', 'updated_at_display', 'updated_by_display')
    list_filter = ('program__name', 'program__division__name', 'gender', 'created_at', 'updated_at', 'created_by', 'updated_by')
    search_fields = ('program__name',) 
    readonly_fields = ('program', 'created_at', 'updated_at', 'created_by', 'updated_by') 
    list_select_related = ('program', 'program__division', 'created_by', 'updated_by')

    def program_name(self, obj):
        return obj.program.get_name_display()
    program_name.short_description = 'Program'
    program_name.admin_order_field = 'program__name'

    def date_created_display(self, obj):
        return obj.created_at
    date_created_display.short_description = 'Created At'
    date_created_display.admin_order_field = 'created_at'

    def created_at_display(self, obj):
        return obj.created_at
    created_at_display.short_description = 'Created At'
    created_at_display.admin_order_field = 'created_at'

    def updated_at_display(self, obj):
        return obj.updated_at
    updated_at_display.short_description = 'Updated At'
    updated_at_display.admin_order_field = 'updated_at'

    def created_by_display(self, obj):
        return obj.created_by.full_name if obj.created_by else None
    created_by_display.short_description = 'Created By'
    created_by_display.admin_order_field = 'created_by__full_name'

    def updated_by_display(self, obj):
        return obj.updated_by.full_name if obj.updated_by else None
    updated_by_display.short_description = 'Updated By'
    updated_by_display.admin_order_field = 'updated_by__full_name'

    def gender_display(self, obj):
        return obj.get_gender_display() if hasattr(obj, 'get_gender_display') else obj.gender
    gender_display.short_description = 'Gender'
    gender_display.admin_order_field = 'gender'

@admin.register(EducationProgramDetail)
class EducationProgramDetailAdmin(BaseProgramDetailAdmin):
    list_display = ('student_name', 'school', 'grade', 'start_year', 'graduation_year') + BaseProgramDetailAdmin.list_display
    search_fields = BaseProgramDetailAdmin.search_fields + ('student_name', 'school', 'grade', 'address', 'guardian_name')

@admin.register(MicroFundProgramDetail)
class MicroFundProgramDetailAdmin(BaseProgramDetailAdmin):
    list_display = ('person_name', 'chama_group', 'is_active', 'location', 'money_received') + BaseProgramDetailAdmin.list_display
    search_fields = BaseProgramDetailAdmin.search_fields + ('person_name', 'chama_group', 'location', 'story', 'background')

@admin.register(RescueProgramDetail)
class RescueProgramDetailAdmin(BaseProgramDetailAdmin):
    list_display = ('child_name', 'age', 'date_of_rescue', 'case_type', 'location_of_rescue') + BaseProgramDetailAdmin.list_display
    search_fields = BaseProgramDetailAdmin.search_fields + ('child_name', 'location_of_rescue', 'background', 'ob_number')

@admin.register(VocationalTrainingProgramTrainerDetail)
class VocationalTrainingProgramTrainerDetailAdmin(BaseProgramDetailAdmin):
    list_display = ('trainer_name', 'trainer_email', 'trainer_association') + BaseProgramDetailAdmin.list_display
    search_fields = BaseProgramDetailAdmin.search_fields + ('trainer_name', 'trainer_email')

@admin.register(VocationalTrainingProgramTraineeDetail)
class VocationalTrainingProgramTraineeDetailAdmin(admin.ModelAdmin): 
    list_display = ('trainee_name', 'trainer_name_display', 'gender_display', 'start_date', 'post_training_status', 'created_at_display', 'created_by_display', 'updated_at_display', 'updated_by_display')
    list_filter = ('trainer__program__name', 'trainer__program__division__name', 'post_training_status', 'gender', 'created_at', 'updated_at', 'created_by', 'updated_by')
    search_fields = ('trainee_name', 'trainee_email', 'trainer__trainer_name', 'gender', 'training_received', 'background')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    list_select_related = ('trainer', 'trainer__program', 'created_by', 'updated_by')

    def trainer_name_display(self, obj):
        return obj.trainer.trainer_name
    trainer_name_display.short_description = 'Trainer'
    trainer_name_display.admin_order_field = 'trainer__trainer_name'

    # Re-define display methods for audit fields as they are not inherited
    def created_at_display(self, obj): return obj.created_at
    created_at_display.short_description = 'Created At'; created_at_display.admin_order_field = 'created_at'
    def updated_at_display(self, obj): return obj.updated_at 
    updated_at_display.short_description = 'Updated At'; updated_at_display.admin_order_field = 'updated_at'
    def created_by_display(self, obj): return obj.created_by.full_name if obj.created_by else None
    created_by_display.short_description = 'Created By'; created_by_display.admin_order_field = 'created_by__full_name'
    def updated_by_display(self, obj): return obj.updated_by.full_name if obj.updated_by else None
    updated_by_display.short_description = 'Updated By'; updated_by_display.admin_order_field = 'updated_by__full_name'
    def gender_display(self, obj): return obj.get_gender_display()
    gender_display.short_description = 'Gender'; gender_display.admin_order_field = 'gender'
