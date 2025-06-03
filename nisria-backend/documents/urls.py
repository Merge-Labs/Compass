from django.urls import path
from . import views

urlpatterns = [
    path('', views.document_list_create, name='document-list-create'),
    path('<int:pk>/', views.document_detail_update, name='document-detail-update'),
    # path('api/bank-statements/previews/', views.bank_statement_preview_list, name='bank_statement_previews'),
    path('filter/', views.DocumentFilterView.as_view(), name='document-filter'),
    path('search/', views.document_search, name='document-search'),

    # Bank Statement Access Endpoints
    path('access/request/<int:document_id>/', views.request_bank_statement_access, name='request-access'),
    path('access/grant/<uuid:pin>/', views.grant_bank_statement_access, name='grant-access'),
    path('access/validate/<uuid:pin>/', views.validate_bank_statement_access, name='validate-access'),
    path('preview/', views.all_documents_preview_list, name='all_documents_preview_list'),

    path('<int:id>/soft-delete/', views.document_soft_delete, name='document-soft-delete'),
    path('recycle-bin/', views.document_recycle_bin, name='document-recycle-bin'),
    path('<int:id>/restore/', views.document_restore, name='document-restore'),
    path('<int:id>/permanent-delete/', views.document_permanent_delete, name='document-permanent-delete'),
]
