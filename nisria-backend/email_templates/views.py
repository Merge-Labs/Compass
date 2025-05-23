from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
import markdown
from django.template import Context, Template

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import EmailTemplates 
from .serializers import EmailTemplateSerializer
from .filters import EmailTemplateFilter
import urllib.parse 


def indexTest(request):
    return JsonResponse({"message": "API endpoints working in Email Templates app"})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def email_template_list_create_view(request):
    
    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    is_privileged_user = request.user.role in ['super_admin', 'management_lead']

    if request.method == 'GET':
        queryset = EmailTemplates.objects.all().order_by('-date_created')

        if not is_privileged_user:
            queryset = queryset.exclude(template_type='employee_contract')

        filterset = EmailTemplateFilter(request.GET, queryset=queryset)
        filtered_queryset = filterset.qs

        serializer = EmailTemplateSerializer(filtered_queryset, many=True, context={'request': request})
        return Response(serializer.data)

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



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def email_template_detail_view(request, pk):
    
    template = get_object_or_404(EmailTemplates, pk=pk)
    is_privileged_user = request.user.role in ['super_admin', 'management_lead']

    if request.method == 'GET':
        # If the template is 'employee_contract' and user is not privileged, deny access
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




@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def render_email_template_view(request, pk):
    template_obj = get_object_or_404(EmailTemplates, pk=pk)

    if template_obj.template_type == 'employee_contract' and request.user.role not in ['super_admin', 'management_lead']:
        raise PermissionDenied("Unauthorized access.")

    if request.method == 'GET':
        return Response({
            "template_name": template_obj.name,
            "raw_subject_template": template_obj.subject_template,
            "raw_body_template": template_obj.body_template,
            "placeholders_hint": "Pass context as POST JSON: { context: { key: value } }"
        })
    
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_email_template_view(request, pk):
    template_obj = get_object_or_404(EmailTemplates, pk=pk)

    # Permission check
    if template_obj.template_type == 'employee_contract' and request.user.role not in ['super_admin', 'management_lead']:
        return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

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