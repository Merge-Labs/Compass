from django.urls import path
from . import views

urlpatterns = [
    path('', views.document_list_create, name='document-list-create'),
    path('<int:pk>/', views.document_detail_update, name='document-detail-update'),
    path('filter/', views.DocumentFilterView.as_view(), name='document-filter'),
    path('search/', views.document_search, name='document-search'),
    # path('request-access/', views.request_document_access, name='request-access'),
    # path('<int:pk>/grant-access/', views.grant_document_access, name='grant-access'),
]
