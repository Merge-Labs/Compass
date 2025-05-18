from django.urls import path
from . import views

# Create your views here.
urlpatterns = [
    path('', views.indexTest, name='indexTest'),

    # Division Endpoints
    path('divisions/', views.division_list_create, name='division-list-create'),
    path('divisions/<int:pk>/', views.division_detail_view, name='division-detail'),

    # Program Endpoints
    # Education Programs (nisria -> nisira)
    path('<str:division_name>/education/', views.education_program_list_create, name='educationprogram-list-create'),
    path('<str:division_name>/education/<int:pk>/', views.education_program_detail, name='educationprogram-detail'),
    path('<str:division_name>/education/filter/', views.education_program_filter, name='educationprogram-filter'),
    path('<str:division_name>/education/search/', views.education_program_search, name='educationprogram-search'),
    path('<str:division_name>/education/<int:pk>/details/', views.education_program_get_details, name='educationprogram-get-details'),

    # MicroFund Programs (nisria -> nisira)
    path('<str:division_name>/microfund/', views.microfund_program_list_create, name='microfundprogram-list-create'),
    path('<str:division_name>/microfund/<int:pk>/', views.microfund_program_detail, name='microfundprogram-detail'),
    path('<str:division_name>/microfund/filter/', views.microfund_program_filter, name='microfundprogram-filter'),
    path('<str:division_name>/microfund/search/', views.microfund_program_search, name='microfundprogram-search'),
    path('<str:division_name>/microfund/<int:pk>/details/', views.microfund_program_get_details, name='microfundprogram-get-details'),

    # Rescue Programs (nisria -> nisira)
    path('<str:division_name>/rescue/', views.rescue_program_list_create, name='rescueprogram-list-create'),
    path('<str:division_name>/rescue/<int:pk>/', views.rescue_program_detail, name='rescueprogram-detail'),
    path('<str:division_name>/rescue/filter/', views.rescue_program_filter, name='rescueprogram-filter'),
    path('<str:division_name>/rescue/search/', views.rescue_program_search, name='rescueprogram-search'),
    path('<str:division_name>/rescue/<int:pk>/details/', views.rescue_program_get_details, name='rescueprogram-get-details'),

    # Vocational Training Programs (maisha -> maisha)
    path('<str:division_name>/vocational/', views.vocational_program_list_create, name='vocationalprogram-list-create'),
    path('<str:division_name>/vocational/<int:pk>/', views.vocational_program_detail, name='vocationalprogram-detail'),
    path('<str:division_name>/vocational/filter/', views.vocational_program_filter, name='vocationalprogram-filter'),
    path('<str:division_name>/vocational/search/', views.vocational_program_search, name='vocationalprogram-search'),
    path('<str:division_name>/vocational/<int:pk>/details/', views.vocational_program_get_details, name='vocationalprogram-get-details'),
 
]
