from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from accounts.permissions import IsSuperAdmin
from .models import Document, BankStatementAccessRequest
from .serializers import DocumentSerializer, BankStatementPreviewSerializer, AccessRequestSerializer, ValidatedBankStatementAccessResponseSerializer
from core.models import RecycleBinItem # Import RecycleBinItem for permanent delete
from drf_yasg import openapi # Import openapi for manual parameters
from notifications.tasks import create_bank_statement_access_granted_notification_task
from drf_yasg.utils import swagger_auto_schema # Import swagger_auto_schema
from .filters import DocumentFilter
from django.contrib.contenttypes.models import ContentType # Add this import
from django.utils import timezone

# Reusable pagination class
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


# /api/documents/ [GET, POST]
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of documents, excluding bank statements.",
    responses={
        200: DocumentSerializer(many=True), # drf-yasg handles pagination structure
        401: 'Unauthorized'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new document.",
    request_body=DocumentSerializer,
    responses={
        201: DocumentSerializer,
        400: 'Bad Request - Invalid data provided',
        401: 'Unauthorized'
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def document_list_create(request):
    if request.method == 'GET':
        if request.user.role == 'super_admin':
            documents = Document.objects.all().order_by('-date_uploaded')
        else:
            documents = Document.objects.exclude(document_type='bank_statement').order_by('-date_uploaded')
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(documents, request)
        serializer = DocumentSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# /api/documents/<id>/ [GET, PUT]
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a specific document by its ID. Access to bank statements is restricted.",
    responses={
        200: DocumentSerializer,
        401: 'Unauthorized',
        403: 'Forbidden - Access to bank statement denied or requires special approval.',
        404: 'Document Not Found'
    }
)
@swagger_auto_schema(
    method='put',
    operation_description="Update a specific document by its ID. Updating bank statements is restricted.",
    request_body=DocumentSerializer,
    responses={
        200: DocumentSerializer,
        400: 'Bad Request - Invalid data provided',
        401: 'Unauthorized',
        403: 'Forbidden - Updating bank statement denied or requires special approval.',
        404: 'Document Not Found'
    }
)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def document_detail_update(request, pk):
    document = get_object_or_404(Document, pk=pk)

    if request.method == 'GET':
        # Check if document is a bank statement
        if document.document_type == 'bank_statement':
            # Only allow super_admin role to see it directly
            if not request.user.role == 'super_admin':
                return Response(
                    {"message": "Access denied. Bank statement requires special access approval."},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = DocumentSerializer(document)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if document.document_type == 'bank_statement':
            # Only allow super_admin role to update it
            if not request.user.role == 'super_admin':
                return Response(
                    {"message": "Access denied. Bank statement requires special access approval."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
        serializer = DocumentSerializer(document, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /api/documents/filter/ [GET]
@swagger_auto_schema(
    operation_description="Filter documents based on various criteria (type, format, division, name). Excludes bank statements.",
    # drf-yasg should infer query parameters from filterset_class
    responses={
        200: DocumentSerializer(many=True), # drf-yasg handles pagination
        401: 'Unauthorized'
    }
)
class DocumentFilterView(ListAPIView):
    queryset = Document.objects.exclude(document_type='bank_statement').order_by('-date_uploaded')
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = DocumentFilter
    pagination_class = StandardResultsSetPagination


# /api/documents/search/ [GET]
@swagger_auto_schema(
    method='get',
    operation_description="Search documents by name. Excludes bank statements.",
    manual_parameters=[
        openapi.Parameter(
            'name', openapi.IN_QUERY,
            description="Term to search for in document names.",
            type=openapi.TYPE_STRING,
            required=False # Or True if you want to enforce it
        )
    ],
    responses={
        200: DocumentSerializer(many=True), # drf-yasg handles pagination
        401: 'Unauthorized'
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_search(request):
    query = request.query_params.get('name', '')
    documents = Document.objects.exclude(document_type='bank_statement').filter(name__icontains=query).order_by('-date_uploaded')
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(documents, request)
    serializer = DocumentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# /api/documents/<id>/request-access/ [POST]
@swagger_auto_schema(
    method='post',
    operation_description="Request access to a specific bank statement document. A PIN will be generated for approval.",
    responses={
        201: openapi.Response(
            description="Access request submitted successfully. PIN for approval is returned.",
            examples={"application/json": {"message": "Access request submitted. Wait for approval.", "pin": "uuid-string-here"}}
        ),
        401: 'Unauthorized',
        404: 'Bank Statement Document Not Found'
    },
    # No request body needed as document_id is in the URL and user is from request
    request_body=None 
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_bank_statement_access(request, document_id):
    document = get_object_or_404(Document, pk=document_id, document_type='bank_statement')

    access_request = BankStatementAccessRequest.objects.create(
        user=request.user,
        document=document
    )
    return Response({
        "message": "Access request submitted. Wait for approval.",
        "pin": str(access_request.pin)
    }, status=status.HTTP_201_CREATED)

# /api/access/grant/<uuid:pin>/ [POST]
@swagger_auto_schema(
    method='post',
    operation_description="Grant access to a bank statement using the provided PIN. (SuperAdmin only)",
    responses={
        200: openapi.Response(description="Access granted successfully."),
        401: 'Unauthorized (User is not SuperAdmin)',
        403: 'Forbidden (User is not SuperAdmin)', # IsSuperAdmin permission handles this
        404: 'Access Request Not Found (Invalid PIN)'
    },
    request_body=None # No request body needed
)
@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def grant_bank_statement_access(request, pin):
    access_request = get_object_or_404(BankStatementAccessRequest, pin=pin)
    access_request.is_granted = True
    access_request.save()
    # Send notification to the user who requested access
    create_bank_statement_access_granted_notification_task.delay(
        user_id=access_request.user.id,
        document_name=access_request.document.name,
        pin_value=str(access_request.pin)
    )
    return Response({"message": "Access granted successfully."})

# /api/access/validate/<uuid:pin>/ [POST]
@swagger_auto_schema(
    method='post',
    operation_description="Validate a PIN to access a bank statement. If valid, returns document details.",
    responses={
        200: ValidatedBankStatementAccessResponseSerializer,
        401: 'Unauthorized',
        403: 'Forbidden - Access denied or PIN expired/invalid.',
        404: 'Access Request Not Found (Invalid PIN for this user)'
    },
    request_body=None # No request body needed
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_bank_statement_access(request, pin):
    access_request = get_object_or_404(BankStatementAccessRequest, pin=pin, user=request.user)

    if access_request.is_valid():
        document = access_request.document
        response_data = {
            "message": "Access granted.",
            "document": DocumentSerializer(document).data
        }
        return Response(response_data)
    else:
        return Response({"error": "Access denied or expired."}, status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a list of previews for bank statement documents (ID, name, description, division, date_uploaded).",
     responses={
        200: BankStatementPreviewSerializer(many=True), # drf-yasg handles pagination structure
        401: 'Unauthorized'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bank_statement_preview_list(request):
    """
    Retrieve a paginated list of previews specifically for bank statement documents.
    """
    documents = Document.objects.filter(document_type='bank_statement').order_by('-date_uploaded')
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(documents, request)
    serializer = BankStatementPreviewSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of previews for all documents (ID, name, description, division, date_uploaded).",
    responses={
        200: BankStatementPreviewSerializer(many=True), 
        401: 'Unauthorized'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_documents_preview_list(request): # Renamed from a_documents_preview_list
    """
    Retrieve a paginated list of previews for all documents.
    """
    documents = Document.objects.all().order_by('-date_uploaded')
    paginator = StandardResultsSetPagination() # Added pagination
    result_page = paginator.paginate_queryset(documents, request)
    serializer = BankStatementPreviewSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def document_soft_delete(request, id):
    document = Document.objects.filter(id=id, is_deleted=False).first()
    if not document:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Use the SoftDeleteModel's soft_delete method
    # This will also create a RecycleBinItem in the core app
    document.soft_delete(user=request.user)
    return Response({'detail': 'Moved to recycle bin.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin]) # Changed to IsSuperAdmin
def document_recycle_bin(request):
    # Use all_objects manager to fetch soft-deleted items
    documents = Document.all_objects.filter(is_deleted=True).order_by('-deleted_at') # Added order_by
    paginator = StandardResultsSetPagination() # Use the defined pagination class
    result_page = paginator.paginate_queryset(documents, request)
    serializer = DocumentSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsSuperAdmin]) # Changed to IsSuperAdmin
def document_restore(request, id):
    # Use all_objects manager to find the soft-deleted item
    document = Document.all_objects.filter(id=id, is_deleted=True).first()
    if not document:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Use the SoftDeleteModel's restore method
    document.restore() # This will set is_deleted=False and update RecycleBinItem's restored_at
    return Response({'detail': 'Restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin]) # Changed to IsSuperAdmin
def document_permanent_delete(request, id):
    # Use all_objects manager to find the soft-deleted item
    document = Document.all_objects.filter(id=id, is_deleted=True).first()
    if not document:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    document_pk = document.pk # Store pk before document object is deleted
    # This will call the SoftDeleteModel's delete method.
    # If request.user is super_admin, it will perform a hard delete.
    document.delete(user=request.user)

    # Also, delete the corresponding RecycleBinItem from the core app
    # Note: Document uses BigAutoField, so object_id_int is used
    RecycleBinItem.objects.filter( # Changed from all_objects to objects
        content_type=ContentType.objects.get_for_model(Document),
        object_id_int=document_pk 
    ).delete()
    return Response({'detail': 'Permanently deleted.'}, status=204)