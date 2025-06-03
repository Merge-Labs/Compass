from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
import markdown
from django.utils import timezone
from django.template import Context, Template
from django.contrib.contenttypes.models import ContentType
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import EmailTemplates
from .serializers import EmailTemplateSerializer
from .filters import EmailTemplateFilter
import urllib.parse 
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from accounts.permissions import IsSuperAdmin
from core.models import RecycleBinItem # For permanent delete

def indexTest(request):
    return JsonResponse({"message": "API endpoints working in Email Templates app"})


@swagger_auto_schema(
    method='get',
    responses={200: EmailTemplateSerializer(many=True)}
)
@swagger_auto_schema(
    method='post',
    request_body=EmailTemplateSerializer,
    responses={201: EmailTemplateSerializer()}
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def email_template_list_create_view(request):
    
    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    is_privileged_user = request.user.role in ['super_admin', 'management_lead']

    if request.method == 'GET':
        # Default manager 'objects' already filters out is_deleted=True items
        queryset = EmailTemplates.objects.order_by('-date_created')

        if not is_privileged_user:
            queryset = queryset.exclude(template_type='employee_contract')

        filterset = EmailTemplateFilter(request.GET, queryset=queryset)
        filtered_queryset = filterset.qs

        paginator = PageNumberPagination()
        paginator.page_size = 10 # Or your preferred page size, e.g., from settings
        result_page = paginator.paginate_queryset(filtered_queryset, request)

        serializer = EmailTemplateSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


    elif request.method == 'POST':
        requested_template_type = request.data.get('template_type')

        if requested_template_type == 'employee_contract':
            if not is_privileged_user:
                raise PermissionDenied("You do not have permission to create 'employee_contract' templates.")

        serializer = EmailTemplateSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(created_by=request.user, updated_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@swagger_auto_schema(
    method='get',
    responses={200: EmailTemplateSerializer()}
)
@swagger_auto_schema(
    method='put',
    request_body=EmailTemplateSerializer,
    responses={200: EmailTemplateSerializer()}
)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def email_template_detail_view(request, pk):
    # Use the default manager which respects is_deleted=False
    template = get_object_or_404(EmailTemplates, pk=pk) 
    is_privileged_user = request.user.role in ['super_admin', 'management_lead']

    if request.method == 'GET':
        if template.template_type == 'employee_contract' and not is_privileged_user:
            raise PermissionDenied("You do not have permission to view this email template.")
        
        serializer = EmailTemplateSerializer(template, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        requested_template_type = request.data.get('template_type', template.template_type)

        if (template.template_type == 'employee_contract' or requested_template_type == 'employee_contract') and not is_privileged_user:
            raise PermissionDenied("You do not have permission to modify this email template or set its type to 'employee_contract'.")

        serializer = EmailTemplateSerializer(template, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@swagger_auto_schema(
    method='get',
    responses={200: openapi.Response(
        description="Raw template and placeholders info",
        examples={
            "application/json": {
                "template_name": "Welcome",
                "raw_subject_template": "Subject with {{placeholder}}",
                "raw_body_template": "Body with {{placeholder}}",
                "placeholders_hint": "Pass context as POST JSON: { context: { key: value } }"
            }
        }
    )}
)
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'context': openapi.Schema(type=openapi.TYPE_OBJECT)
        },
        required=[]
    ),
    responses={200: openapi.Response(
        description="Rendered subject and body",
        examples={
            "application/json": {
                "template_name": "Welcome",
                "rendered_subject": "Hello John",
                "rendered_body_markdown": "Hi **John**",
                "rendered_body_html": "<p>Hi <strong>John</strong></p>"
            }
        }
    )}
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def render_email_template_view(request, pk):
    # Use the default manager which respects is_deleted=False
    template_obj = get_object_or_404(EmailTemplates, pk=pk) 
    if request.method == 'GET':
        return Response({
            "template_name": template_obj.name,
            "raw_subject_template": template_obj.subject_template,
            "raw_body_template": template_obj.body_template,
            "placeholders_hint": "Pass context as POST JSON: { context: { key: value } }"
        })
    
    # Permission check for POST (rendering) as well, if it involves sensitive data based on type
    if template_obj.template_type == 'employee_contract' and request.user.role not in ['super_admin', 'management_lead']:
        raise PermissionDenied("You do not have permission to render this template.")
    elif request.method == 'POST':
        context_data = request.data.get('context', {})

        context = Context(context_data)
        subject = Template(template_obj.subject_template).render(context)
        body_raw = Template(template_obj.body_template).render(context)

        # Convert Markdown to HTML
        body_html = markdown.markdown(body_raw)

        return Response({
            "template_name": template_obj.name,
            "rendered_subject": subject,
            "rendered_body_markdown": body_raw,
            "rendered_body_html": body_html
        })


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'context': openapi.Schema(type=openapi.TYPE_OBJECT),
            'to': openapi.Schema(type=openapi.TYPE_STRING, description="Recipient email")
        },
        required=['to']
    ),
    responses={200: openapi.Response(
        description="Gmail compose URL and rendered content",
        examples={
            "application/json": {
                "template_name": "Welcome",
                "gmail_url": "https://mail.google.com/mail/?view=cm&fs=1&to=...",
                "rendered_subject": "Hello John",
                "rendered_body": "<p>Hi <strong>John</strong></p>"
            }
        }
    )}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_email_template_view(request, pk):
    # Use the default manager which respects is_deleted=False
    template_obj = get_object_or_404(EmailTemplates, pk=pk) 

    # Permission check
    if template_obj.template_type == 'employee_contract' and request.user.role not in ['super_admin', 'management_lead']:
        raise PermissionDenied("You do not have permission to export this template.")

    # Get context and recipient email
    context_data = request.data.get("context", {}) or {}
    recipient_email = request.data.get("to", "").strip()

    # Render subject and body using templates
    subject_template = Template(template_obj.subject_template)
    body_template = Template(template_obj.body_template)
    ctx = Context(context_data)

    rendered_subject = subject_template.render(ctx)
    rendered_body = body_template.render(ctx)
    rendered_body_html = markdown.markdown(rendered_body)

    # Gmail Compose URL (better for long emails than mailto:)
    base_url = "https://mail.google.com/mail/?view=cm&fs=1"
    query_params = {
        "to": recipient_email,
        "su": rendered_subject,
        "body": rendered_body_html
    }
    gmail_url = f"{base_url}&{urllib.parse.urlencode(query_params)}"

    return Response({
        "template_name": template_obj.name,
        "gmail_url": gmail_url,
        "rendered_subject": rendered_subject,
        "rendered_body": rendered_body_html
    })
# TODO:: IN frontend do window.open(response.data.gmail_url, '_blank');


# Soft delete (move to recycle bin)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def email_template_soft_delete(request, pk):
    # Use default manager, which filters for is_deleted=False
    template = get_object_or_404(EmailTemplates, pk=pk)
    # Use the SoftDeleteModel's soft_delete method
    template.soft_delete(user=request.user)
    return Response({'detail': 'Moved to recycle bin.'}, status=status.HTTP_204_NO_CONTENT)

# List recycle bin
@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def email_template_recycle_bin(request):
    # Use all_objects manager to fetch soft-deleted items
    templates = EmailTemplates.all_objects.filter(is_deleted=True).order_by('-deleted_at')
    
    paginator = PageNumberPagination()
    paginator.page_size = 10 # Or your preferred page size
    result_page = paginator.paginate_queryset(templates, request)
    
    serializer = EmailTemplateSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

# Restore from recycle bin
@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def email_template_restore(request, pk):
    # Use all_objects manager to find the soft-deleted item
    template = EmailTemplates.all_objects.filter(pk=pk, is_deleted=True).first()
    if not template:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Use the SoftDeleteModel's restore method
    template.restore() # This will set is_deleted=False and update RecycleBinItem
    return Response({'detail': 'Restored.'})

# Permanent delete
@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def email_template_permanent_delete(request, pk):
    # Use all_objects manager to find the soft-deleted item
    template = EmailTemplates.all_objects.filter(pk=pk, is_deleted=True).first()
    if not template:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    template_pk = template.pk # Store pk before template object is deleted
    
    # This will call the SoftDeleteModel's delete method.
    # If request.user is super_admin and item is_deleted=True, it will perform a hard delete.
    template.delete(user=request.user) 

    # Also, delete the corresponding RecycleBinItem from the core app
    # EmailTemplates uses UUIDField for pk, so object_id_uuid is used
    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(EmailTemplates),
        object_id_uuid=template_pk 
    ).delete()
    return Response({'detail': 'Permanently deleted.'}, status=status.HTTP_204_NO_CONTENT)