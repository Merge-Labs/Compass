from django.urls import path
from . import views

# Create your views here.
urlpatterns = [
    path('', views.indexTest, name='indexTest'),

    # Division Endpoints
    path('divisions/', views.division_list_create, name='division-list-create'),
    path('divisions/<uuid:pk>/', views.division_detail_view, name='division-detail'),

    # Program Definition Endpoints (Manage the Program objects themselves)
    path('programs/', views.program_list_create, name='program-list-create'),
    path('programs/<uuid:pk>/', views.program_detail_view, name='program-detail'),


    # Education Program Details (nisria)
    path('<str:division_name>/education/', views.education_program_list_create, name='educationprogram-list-create'),
    path('<str:division_name>/education/<uuid:pk>/', views.education_program_detail, name='educationprogram-detail'),
    path('<str:division_name>/education/filter/', views.education_program_filter, name='educationprogram-filter'),
    path('<str:division_name>/education/search/', views.education_program_search, name='educationprogram-search'),

    # MicroFund Program Details (nisria)
    path('<str:division_name>/microfund/', views.microfund_program_list_create, name='microfundprogram-list-create'),
    path('<str:division_name>/microfund/<uuid:pk>/', views.microfund_program_detail, name='microfundprogram-detail'),
    path('<str:division_name>/microfund/filter/', views.microfund_program_filter, name='microfundprogram-filter'),
    path('<str:division_name>/microfund/search/', views.microfund_program_search, name='microfundprogram-search'),

    # Rescue Program Details (nisria)
    path('<str:division_name>/rescue/', views.rescue_program_list_create, name='rescueprogram-list-create'),
    path('<str:division_name>/rescue/<uuid:pk>/', views.rescue_program_detail, name='rescueprogram-detail'),
    path('<str:division_name>/rescue/filter/', views.rescue_program_filter, name='rescueprogram-filter'),
    path('<str:division_name>/rescue/search/', views.rescue_program_search, name='rescueprogram-search'),

    # Vocational Training Program Trainer Details (maisha)
    path('<str:division_name>/vocational-trainers/', views.vocational_trainer_list_create, name='vocationaltrainer-list-create'),
    path('<str:division_name>/vocational-trainers/<uuid:pk>/', views.vocational_trainer_detail, name='vocationaltrainer-detail'),

    # Vocational Training Program Trainee Details (maisha) - Linked to trainers
    path('<str:division_name>/vocational-trainers/<uuid:trainer_pk>/trainees/', views.vocational_trainee_list_create, name='vocationaltrainee-list-create'),
    path('<str:division_name>/vocational-trainers/<uuid:trainer_pk>/trainees/<uuid:pk>/', views.vocational_trainee_detail, name='vocationaltrainee-detail'),
    
    # The existing vocational filter/search might need adjustment or new ones for trainees under a specific trainer
    path('<str:division_name>/vocational/filter/', views.vocational_program_filter, name='vocationalprogram-filter'), 
    path('<str:division_name>/vocational/search/', views.vocational_program_search, name='vocationalprogram-search'), 

    # Division soft delete/recycle bin endpoints
    path('divisions/<uuid:pk>/soft-delete/', views.division_soft_delete, name='division-soft-delete'),
    path('divisions/<uuid:pk>/restore/', views.division_restore, name='division-restore'),
    path('divisions/<uuid:pk>/permanent-delete/', views.division_permanent_delete, name='division-permanent-delete'),
    path('divisions/recycle-bin/', views.division_recycle_bin, name='division-recycle-bin'),

    # Program soft delete/recycle bin endpoints
    path('programs/<uuid:pk>/soft-delete/', views.program_soft_delete, name='program-soft-delete'),
    path('programs/<uuid:pk>/restore/', views.program_restore, name='program-restore'),
    path('programs/<uuid:pk>/permanent-delete/', views.program_permanent_delete, name='program-permanent-delete'),
    path('programs/recycle-bin/', views.program_recycle_bin, name='program-recycle-bin'),
    
    # Education Program Detail soft delete endpoints
    path('<str:division_name>/education/<uuid:pk>/soft-delete/', views.education_program_soft_delete, name='educationprogram-soft-delete'),
    path('<str:division_name>/education/<uuid:pk>/restore/', views.education_program_restore, name='educationprogram-restore'),
    path('<str:division_name>/education/<uuid:pk>/permanent-delete/', views.education_program_permanent_delete, name='educationprogram-permanent-delete'),
    path('<str:division_name>/education/recycle-bin/', views.education_program_recycle_bin, name='educationprogram-recycle-bin'),
    
    # MicroFund Program Detail soft delete endpoints
    path('<str:division_name>/microfund/<uuid:pk>/soft-delete/', views.microfund_program_soft_delete, name='microfundprogram-soft-delete'),
    path('<str:division_name>/microfund/<uuid:pk>/restore/', views.microfund_program_restore, name='microfundprogram-restore'),
    path('<str:division_name>/microfund/<uuid:pk>/permanent-delete/', views.microfund_program_permanent_delete, name='microfundprogram-permanent-delete'),
    path('<str:division_name>/microfund/recycle-bin/', views.microfund_program_recycle_bin, name='microfundprogram-recycle-bin'),
    
    # Rescue Program Detail soft delete endpoints
    path('<str:division_name>/rescue/<uuid:pk>/soft-delete/', views.rescue_program_soft_delete, name='rescueprogram-soft-delete'),
    path('<str:division_name>/rescue/<uuid:pk>/restore/', views.rescue_program_restore, name='rescueprogram-restore'),
    path('<str:division_name>/rescue/<uuid:pk>/permanent-delete/', views.rescue_program_permanent_delete, name='rescueprogram-permanent-delete'),
    path('<str:division_name>/rescue/recycle-bin/', views.rescue_program_recycle_bin, name='rescueprogram-recycle-bin'),
    
    # Vocational Trainer soft delete endpoints
    path('<str:division_name>/vocational-trainers/<uuid:pk>/soft-delete/', views.vocational_trainer_soft_delete, name='vocationaltrainer-soft-delete'),
    path('<str:division_name>/vocational-trainers/<uuid:pk>/restore/', views.vocational_trainer_restore, name='vocationaltrainer-restore'),
    path('<str:division_name>/vocational-trainers/<uuid:pk>/permanent-delete/', views.vocational_trainer_permanent_delete, name='vocationaltrainer-permanent-delete'),
    path('<str:division_name>/vocational-trainers/recycle-bin/', views.vocational_trainer_recycle_bin, name='vocationaltrainer-recycle-bin'),
    
    # Vocational Trainee soft delete endpoints (nested under trainer)
    path('<str:division_name>/vocational-trainers/<uuid:trainer_pk>/trainees/<uuid:pk>/soft-delete/', views.vocational_trainee_soft_delete, name='vocationaltrainee-soft-delete'),
    path('<str:division_name>/vocational-trainers/<uuid:trainer_pk>/trainees/<uuid:pk>/restore/', views.vocational_trainee_restore, name='vocationaltrainee-restore'),
    path('<str:division_name>/vocational-trainers/<uuid:trainer_pk>/trainees/<uuid:pk>/permanent-delete/', views.vocational_trainee_permanent_delete, name='vocationaltrainee-permanent-delete'),
    path('<str:division_name>/vocational-trainers/<uuid:trainer_pk>/trainees/recycle-bin/', views.vocational_trainee_recycle_bin, name='vocationaltrainee-recycle-bin'),
]
