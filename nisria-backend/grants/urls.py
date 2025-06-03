from django.urls import path
from . import views

app_name = 'grants' # Good practice to add app_name

urlpatterns = [
    path('', views.grant_list_create, name='grant-list-create'),
    path('<uuid:id>/', views.grant_detail, name='grant-detail'),
    path('<uuid:id>/update-status/', views.update_status, name='grant-update-status'), # Specific status update
    # The following filter and search might be better integrated into grant-list-create as query params
    path('filter/', views.grant_filter, name='grant-filter-view'), # Renamed to avoid clash if integrated later
    path('search/', views.grant_search, name='grant-search-view'), # Renamed
    
    path('by-month/<int:year>/<int:month>/', views.grants_by_month, name='grants-by-month'),
    path('<int:id>/documents/', views.grant_documents, name='grant-documents'),

    # GrantExpenditure URLs
    path('expenditures/', views.grant_expenditure_list, name='grant-expenditure-list'),
    path('<uuid:grant_id>/expenditure/', views.grant_expenditure_detail, name='grant-expenditure-detail'),

    path('<uuid:id>/soft-delete/', views.grant_soft_delete, name='grant-soft-delete'),
    path('recycle-bin/', views.grant_recycle_bin, name='grant-recycle-bin'),
    path('<uuid:id>/restore/', views.grant_restore, name='grant-restore'),
    path('<uuid:id>/permanent-delete/', views.grant_permanent_delete, name='grant-permanent-delete'),
]
