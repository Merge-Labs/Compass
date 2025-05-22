from django.urls import path
from . import views

# Create your views here.
urlpatterns = [
    path('', views.indexTest, name='indexTest'),

    # Division Endpoints
    path('divisions/', views.division_list_create, name='division-list-create'),
    path('divisions/<int:pk>/', views.division_detail_view, name='division-detail'),

    # Program Definition Endpoints (Manage the Program objects themselves)
    path('programs/', views.program_list_create, name='program-list-create'),
    path('programs/<int:pk>/', views.program_detail_view, name='program-detail'),


    # Education Program Details (nisria)
    path('<str:division_name>/education/', views.education_program_list_create, name='educationprogram-list-create'),
    path('<str:division_name>/education/<int:pk>/', views.education_program_detail, name='educationprogram-detail'),
    path('<str:division_name>/education/filter/', views.education_program_filter, name='educationprogram-filter'),
    path('<str:division_name>/education/search/', views.education_program_search, name='educationprogram-search'),

    # MicroFund Program Details (nisria)
    path('<str:division_name>/microfund/', views.microfund_program_list_create, name='microfundprogram-list-create'),
    path('<str:division_name>/microfund/<int:pk>/', views.microfund_program_detail, name='microfundprogram-detail'),
    path('<str:division_name>/microfund/filter/', views.microfund_program_filter, name='microfundprogram-filter'),
    path('<str:division_name>/microfund/search/', views.microfund_program_search, name='microfundprogram-search'),

    # Rescue Program Details (nisria)
    path('<str:division_name>/rescue/', views.rescue_program_list_create, name='rescueprogram-list-create'),
    path('<str:division_name>/rescue/<int:pk>/', views.rescue_program_detail, name='rescueprogram-detail'),
    path('<str:division_name>/rescue/filter/', views.rescue_program_filter, name='rescueprogram-filter'),
    path('<str:division_name>/rescue/search/', views.rescue_program_search, name='rescueprogram-search'),

    # Vocational Training Program Trainer Details (maisha)
    path('<str:division_name>/vocational-trainers/', views.vocational_trainer_list_create, name='vocationaltrainer-list-create'),
    path('<str:division_name>/vocational-trainers/<int:pk>/', views.vocational_trainer_detail, name='vocationaltrainer-detail'),

    # Vocational Training Program Trainee Details (maisha) - Linked to trainers
    path('<str:division_name>/vocational-trainers/<int:trainer_pk>/trainees/', views.vocational_trainee_list_create, name='vocationaltrainee-list-create'),
    path('<str:division_name>/vocational-trainers/<int:trainer_pk>/trainees/<int:pk>/', views.vocational_trainee_detail, name='vocationaltrainee-detail'),
    
    # The existing vocational filter/search might need adjustment or new ones for trainees under a specific trainer
    path('<str:division_name>/vocational/filter/', views.vocational_program_filter, name='vocationalprogram-filter'), 
    path('<str:division_name>/vocational/search/', views.vocational_program_search, name='vocationalprogram-search'), 
]
