from  django.http import JsonResponse
from django.db.models import Count, Sum, Q, F, Avg, DecimalField
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated 

from accounts.models import User as AccountUser 
from documents.models import Document, BankStatementAccessRequest
from divisions.models import (
    Division, Program,
    EducationProgramDetail, MicroFundProgramDetail, RescueProgramDetail,
    VocationalTrainingProgramTrainerDetail, VocationalTrainingProgramTraineeDetail
)
from email_templates.models import EmailTemplates
from task_manager.models import Task

try:
    from grants.models import Grant
    GRANTS_APP_AVAILABLE = True
except ImportError:
    GRANTS_APP_AVAILABLE = False
    Grant = None 

# Helper function to get counts by a specific field
def get_counts_by_field(queryset, field_name):
    """ Helper to get counts grouped by a specific field. """
    return queryset.values(field_name).annotate(count=Count('id')).order_by(field_name)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def dashboard_analytics(request):
    """
    Provides aggregated data from various apps for the dashboard.
    """
    today = timezone.now().date()
    analytics_data = {}

    # --- Accounts Analytics ---
    total_users = AccountUser.objects.count()
    users_by_role = list(get_counts_by_field(AccountUser.objects.all(), 'role'))
    active_users = AccountUser.objects.filter(is_active=True).count()
    
    analytics_data['accounts'] = {
        'total_users': total_users,
        'users_by_role': users_by_role,
        'active_users': active_users,
        'inactive_users': total_users - active_users,
    }

    # --- Documents Analytics ---
    total_documents = Document.objects.count()
    documents_by_type = list(get_counts_by_field(Document.objects.all(), 'document_type'))
    documents_by_format = list(get_counts_by_field(Document.objects.all(), 'document_format'))
    # Assuming 'division' in Document model is a CharField storing the division name directly
    documents_by_division_origin = list(get_counts_by_field(Document.objects.all(), 'division'))
    
    total_bs_requests = BankStatementAccessRequest.objects.count()
    granted_bs_requests = BankStatementAccessRequest.objects.filter(is_granted=True).count()
    
    analytics_data['documents'] = {
        'total_documents': total_documents,
        'documents_by_type': documents_by_type,
        'documents_by_format': documents_by_format,
        'documents_by_division_origin': documents_by_division_origin,
        'bank_statement_access': {
            'total_requests': total_bs_requests,
            'granted_requests': granted_bs_requests,
            'pending_requests': total_bs_requests - granted_bs_requests,
        }
    }

    # --- Divisions & Programs Analytics ---
    total_divisions = Division.objects.count()
    total_programs = Program.objects.count()
    programs_per_division_qs = Division.objects.annotate(program_count=Count('program')).values('name', 'program_count')
    
    # Sum of all program annual budgets
    total_annual_budget_all_programs = Program.objects.aggregate(
        total=Coalesce(Sum('annual_budget'), 0, output_field=DecimalField())
    )['total']

    education_stats = {
        'total_students': EducationProgramDetail.objects.count(),
        'students_by_gender': list(get_counts_by_field(EducationProgramDetail.objects.all(), 'gender')),
        'students_by_level': list(get_counts_by_field(EducationProgramDetail.objects.all(), 'education_level')),
    }
    microfund_stats = {
        'total_beneficiaries': MicroFundProgramDetail.objects.count(),
        'beneficiaries_by_gender': list(get_counts_by_field(MicroFundProgramDetail.objects.all(), 'gender')),
        'active_beneficiaries': MicroFundProgramDetail.objects.filter(is_active=True).count(),
    }
    rescue_stats = {
        'total_children': RescueProgramDetail.objects.count(),
        'children_by_gender': list(get_counts_by_field(RescueProgramDetail.objects.all(), 'gender')),
        'reunited_children': RescueProgramDetail.objects.filter(is_reunited=True).count(),
        'children_under_care': RescueProgramDetail.objects.filter(under_care=True).count(),
    }
    vocational_stats = {
        'total_trainers': VocationalTrainingProgramTrainerDetail.objects.count(),
        'trainers_by_gender': list(get_counts_by_field(VocationalTrainingProgramTrainerDetail.objects.all(), 'gender')),
        'total_trainees': VocationalTrainingProgramTraineeDetail.objects.count(),
        'trainees_by_gender': list(get_counts_by_field(VocationalTrainingProgramTraineeDetail.objects.all(), 'gender')),
        'trainees_under_training': VocationalTrainingProgramTraineeDetail.objects.filter(under_training=True).count(),
    }

    analytics_data['divisions_programs'] = {
        'total_divisions': total_divisions,
        'total_programs': total_programs,
        'programs_per_division': list(programs_per_division_qs),
        'total_annual_budget_all_programs': f"{total_annual_budget_all_programs:.2f}",
        'education_program': education_stats,
        'microfund_program': microfund_stats,
        'rescue_program': rescue_stats,
        'vocational_program': vocational_stats,
    }

    # --- Email Templates Analytics ---
    total_email_templates = EmailTemplates.objects.count()
    templates_by_type = list(get_counts_by_field(EmailTemplates.objects.all(), 'template_type'))
    analytics_data['email_templates'] = {
        'total_templates': total_email_templates,
        'templates_by_type': templates_by_type,
    }

    # --- Grants Analytics ---
    if GRANTS_APP_AVAILABLE and Grant is not None:
        try:
            total_grants = Grant.objects.count()
            # Ensure Grant model has 'status', 'amount_requested', 'amount_approved' fields
            grants_by_status = list(get_counts_by_field(Grant.objects.all(), 'status'))
            
            # Use 'amount_value' as indicated by the error message.
            # For total_amount_requested, sum 'amount_value' for all grants.
            total_amount_requested = Grant.objects.aggregate(
                total=Coalesce(Sum('amount_value'), 0, output_field=DecimalField())
            )['total']
            # For total_amount_approved, sum 'amount_value' for grants with an 'approved' status.
            # You might need to adjust 'approved' to match the exact status value in your Grant model.
            total_amount_approved = Grant.objects.filter(status='approved').aggregate(
                total=Coalesce(Sum('amount_value'), 0, output_field=DecimalField())
            )['total']
            
            analytics_data['grants'] = {
                'total_grants': total_grants,
                'grants_by_status': grants_by_status,
                'total_amount_requested': f"{total_amount_requested:.2f}",
                'total_amount_approved': f"{total_amount_approved:.2f}",
            }
        except Exception as e:
            analytics_data['grants'] = {'error': f'Could not retrieve grant analytics: Grant model might be missing expected fields. ({str(e)})'}
    else:
        analytics_data['grants'] = {'error': 'Grants app or Grant model not found.'}

    # --- Task Manager Analytics ---
    total_tasks = Task.objects.count()
    tasks_by_status = list(get_counts_by_field(Task.objects.all(), 'status'))
    tasks_by_priority = list(get_counts_by_field(Task.objects.all(), 'priority'))
    overdue_tasks = Task.objects.filter(
        Q(due_date__lt=today) & ~Q(status='completed')
    ).count()
    
    tasks_per_user_data = []
    if total_tasks > 0: # Avoid query if no tasks
        tasks_per_user_raw = Task.objects.filter(assigned_to__isnull=False).values('assigned_to').annotate(count=Count('id'))
        user_ids_for_tasks = [item['assigned_to'] for item in tasks_per_user_raw]
        if user_ids_for_tasks:
            user_map = {user.id: user.full_name for user in AccountUser.objects.filter(id__in=user_ids_for_tasks)}
            tasks_per_user_data = [
                {'user_id': item['assigned_to'], 'user_full_name': user_map.get(item['assigned_to']), 'task_count': item['count']}
                for item in tasks_per_user_raw if user_map.get(item['assigned_to'])
            ]
    
    grant_follow_up_tasks = Task.objects.filter(is_grant_follow_up_task=True).count()

    analytics_data['task_manager'] = {
        'total_tasks': total_tasks,
        'tasks_by_status': tasks_by_status,
        'tasks_by_priority': tasks_by_priority,
        'overdue_tasks': overdue_tasks,
        'tasks_per_user': tasks_per_user_data,
        'grant_follow_up_tasks': grant_follow_up_tasks,
    }

    return JsonResponse(analytics_data)
