from django.contrib import admin
from .models import Division, EducationProgram, MicroFundProgram, RescueProgram, VocationalTrainingProgram

@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'lead', 'date_created', 'date_updated', 'total_budget_display')
    search_fields = ('name', 'description')
    list_filter = ('name', 'date_created', 'date_updated')
    readonly_fields = ('total_budget_display',)

    def total_budget_display(self, obj):
        return obj.total_budget
    total_budget_display.short_description = 'Total Budget (Calculated)'


class ProgramAdminBase(admin.ModelAdmin):
    list_display = ('name', 'division', 'maintainer', 'annual_budget', 'monthly_budget', 'date_created', 'date_updated')
    list_filter = ('division', 'maintainer', 'date_created')
    search_fields = ('name', 'description')
    readonly_fields = ('date_created', 'date_updated')
    list_select_related = ('division', 'maintainer') # Optimize queries

@admin.register(EducationProgram)
class EducationProgramAdmin(ProgramAdminBase):
    list_display = ProgramAdminBase.list_display + ('student_name', 'education_level')
    search_fields = ProgramAdminBase.search_fields + ('student_name',)

@admin.register(MicroFundProgram)
class MicroFundProgramAdmin(ProgramAdminBase):
    list_display = ProgramAdminBase.list_display + ('person_name', 'chama_group', 'is_active')
    search_fields = ProgramAdminBase.search_fields + ('person_name', 'chama_group')

@admin.register(RescueProgram)
class RescueProgramAdmin(ProgramAdminBase):
    list_display = ProgramAdminBase.list_display + ('child_name', 'is_reunited', 'under_care')
    search_fields = ProgramAdminBase.search_fields + ('child_name',)

@admin.register(VocationalTrainingProgram)
class VocationalTrainingProgramAdmin(ProgramAdminBase):
    list_display = ProgramAdminBase.list_display + ('trainer_name', 'trainee_name', 'under_training')
    search_fields = ProgramAdminBase.search_fields + ('trainer_name', 'trainee_name')
