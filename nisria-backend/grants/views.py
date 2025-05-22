from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
import datetime

from .models import Grant, GrantExpenditure
from documents.models import Document  

from .serializers import GrantSerializer, DocumentSerializer, GrantExpenditureSerializer
from .filters import GrantFilter, GrantExpenditureFilter


# Consider defining a custom pagination class for reusability and default settings
# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10  # Default number of items per page
#     page_size_query_param = 'page_size' # Allows client to set page_size
#     max_page_size = 100 # Maximum page size allowed

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


@api_view(['POST']) # Should be PUT or PATCH for updating an existing resource
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

# --- New GrantExpenditure Views ---

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
