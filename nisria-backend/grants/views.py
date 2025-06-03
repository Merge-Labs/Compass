from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from drf_yasg.utils import swagger_auto_schema
from django.contrib.contenttypes.models import ContentType # Add this import
from drf_yasg import openapi
import datetime

from .models import Grant, GrantExpenditure
from documents.models import Document 
from core.models import RecycleBinItem # For permanent delete
from accounts.permissions import IsSuperAdmin 

from .serializers import GrantSerializer, DocumentSerializer, GrantExpenditureSerializer
from .filters import GrantFilter, GrantExpenditureFilter


# Consider defining a custom pagination class for reusability and default settings
# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10  # Default number of items per page
#     page_size_query_param = 'page_size' # Allows client to set page_size
#     max_page_size = 100 # Maximum page size allowed

@swagger_auto_schema(
    method='get',
    responses={200: GrantSerializer(many=True)}
)
@swagger_auto_schema(
    method='post',
    request_body=GrantSerializer,
    responses={201: GrantSerializer()}
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def grant_list_create(request):
    if request.method == 'GET':
        # Use GrantFilter for filtering grants
        grant_filter = GrantFilter(request.GET, queryset=Grant.objects.select_related('program', 'submitted_by').all())
        queryset = grant_filter.qs

        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = GrantSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    elif request.method == 'POST':
        serializer = GrantSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(submitted_by=request.user if request.user.is_authenticated else None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    responses={200: GrantSerializer()}
)
@swagger_auto_schema(
    method='put',
    request_body=GrantSerializer,
    responses={200: GrantSerializer()}
)
@api_view(['GET', 'PUT']) 
@permission_classes([IsAuthenticated]) 
def grant_detail(request, id):
    grant = get_object_or_404(Grant, id=id)

    if request.method == 'GET':
        serializer = GrantSerializer(grant, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT': 
        serializer = GrantSerializer(grant, data=request.data, partial=True, context={'request': request}) # partial=True for PATCH-like behavior
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def grant_filter(request): # This view might be redundant if grant_list_create handles filtering
    f = GrantFilter(request.GET, queryset=Grant.objects.all())
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(f.qs, request)
    serializer = GrantSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def grant_search(request): # This view might be redundant
    query = request.GET.get('q', '')
    grants = Grant.objects.filter(
        Q(organization_name__icontains=query) |
        Q(location__icontains=query) |
        Q(notes__icontains=query)
    )
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(grants, request)
    serializer = GrantSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def grant_documents(request, id):
    grant = get_object_or_404(Grant, id=id)
    docs = grant.submitted_documents.all() # Consider prefetching or selecting related if Document has FKs
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(docs, request)
    serializer = DocumentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'status': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=['status']
    ),
    responses={200: GrantSerializer()}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def update_status(request, id): 
    grant = get_object_or_404(Grant, id=id)
    new_status = request.data.get('status')

    # Validate status (assuming STATUS_CHOICES is defined on Grant model)
    if new_status not in [choice[0] for choice in Grant.STATUS_CHOICES]:
        return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    grant.status = new_status
    grant.save() # This will trigger the GrantExpenditure creation logic if applicable
    serializer = GrantSerializer(grant, context={'request': request}) 
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def grants_by_month(request, year, month):
    if not (1 <= month <= 12):
        return Response(
            {"error": "Month must be between 1 and 12."},
            status=status.HTTP_400_BAD_REQUEST
        )
    grants_deadline_in_month = Grant.objects.filter(
        application_deadline__year=year,
        application_deadline__month=month
    )
    deadline_serializer = GrantSerializer(grants_deadline_in_month, many=True, context={'request': request})
    grants_award_date_in_month = Grant.objects.filter(
        award_date__year=year,
        award_date__month=month
    )
    award_date_serializer = GrantSerializer(grants_award_date_in_month, many=True, context={'request': request})
    month_name = datetime.date(year, month, 1).strftime("%B")
    return Response({
        'month_year': f"{month_name} {year}",
        'grants_with_deadline_in_month': deadline_serializer.data,
        'grants_with_award_date_in_month': award_date_serializer.data
     })

@swagger_auto_schema(
    method='get',
    responses={200: GrantExpenditureSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def grant_expenditure_list(request):
    """
    List all grant expenditures, with optional filtering.
    """
    # Use select_related to optimize fetching related grant data
    expenditures = GrantExpenditure.objects.select_related('grant__program').all()
    expenditure_filter = GrantExpenditureFilter(request.GET, queryset=expenditures)
    
    paginator = PageNumberPagination()
    paginator.page_size = 10 # You can adjust this
    result_page = paginator.paginate_queryset(expenditure_filter.qs, request)
    
    serializer = GrantExpenditureSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

@swagger_auto_schema(
    method='get',
    responses={200: GrantExpenditureSerializer()}
)
@swagger_auto_schema(
    methods=['put', 'patch'],
    request_body=GrantExpenditureSerializer,
    responses={200: GrantExpenditureSerializer()}
)
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated]) 
def grant_expenditure_detail(request, grant_id):
    """
    Retrieve, update, or delete the expenditure for a specific grant.
    The GrantExpenditure is created automatically when a grant status changes
    from 'pending' to 'approved'. This endpoint manages an existing expenditure.
    """
    grant = get_object_or_404(Grant, pk=grant_id)
    try:
        expenditure = GrantExpenditure.objects.get(grant=grant)
    except GrantExpenditure.DoesNotExist:
        return Response(
            {"error": "GrantExpenditure for this grant does not exist. It is typically created when the grant is approved."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = GrantExpenditureSerializer(expenditure, context={'request': request})
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        partial = (request.method == 'PATCH')
        serializer = GrantExpenditureSerializer(expenditure, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def grant_soft_delete(request, id):
    grant = Grant.objects.filter(id=id, is_deleted=False).first()
    if not grant:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Use the SoftDeleteModel's soft_delete method
    # This will also create a RecycleBinItem in the core app
    grant.soft_delete(user=request.user)
    return Response({'detail': 'Moved to recycle bin.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def grant_recycle_bin(request):
    # Use all_objects manager to fetch soft-deleted items
    grants = Grant.all_objects.filter(is_deleted=True).order_by('-deleted_at')
    paginator = PageNumberPagination()
    paginator.page_size = 10  # or your preferred page size
    result_page = paginator.paginate_queryset(grants, request)
    serializer = GrantSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def grant_restore(request, id):
   # Use all_objects manager to find the soft-deleted item
    grant = Grant.all_objects.filter(id=id, is_deleted=True).first()
    if not grant:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Use the SoftDeleteModel's restore method
    grant.restore() # This will set is_deleted=False and update RecycleBinItem's restored_at

    # If you need to set restored_by on the RecycleBinItem, the model's restore()
    # method or the RecycleBinItem logic would need to  be enhanced to accept a user.
    # For now, the grant object is restored, and RecycleBinItem.restored_at is set.
    return Response({'detail': 'Restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def grant_permanent_delete(request, id):
    # Use all_objects manager to find the soft-deleted item
    grant = Grant.all_objects.filter(id=id, is_deleted=True).first()
    if not grant:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    grant_pk = grant.pk # Store pk before grant object is deleted
    # This will call the SoftDeleteModel's delete method.
    # If request.user is super_admin, it will perform a hard delete.
    grant.delete(user=request.user) 

    # Also, delete the corresponding RecycleBinItem from the core app
    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(Grant),
        object_id_uuid=grant_pk 
    ).delete()
    return Response({'detail': 'Permanently deleted.'}, status=204)