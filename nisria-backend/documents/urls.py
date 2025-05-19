from django.urls import path
from . import views

urlpatterns = [
    path('', views.document_list_create, name='document-list-create'),
    path('<int:pk>/', views.document_detail_update, name='document-detail-update'),
    path('filter/', views.DocumentFilterView.as_view(), name='document-filter'),
    path('search/', views.document_search, name='document-search'),

        # Bank Statement Access Endpoints
    path('access/request/<int:document_id>/', views.request_bank_statement_access, name='request-access'),
    path('access/grant/<uuid:pin>/', views.grant_bank_statement_access, name='grant-access'),
    path('access/validate/<uuid:pin>/', views.validate_bank_statement_access, name='validate-access'),

]
