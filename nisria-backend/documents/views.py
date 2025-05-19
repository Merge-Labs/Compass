from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView

from .models import Document
from .serializers import DocumentSerializer
from .filters import DocumentFilter

# /api/documents/ [GET, POST]
@api_view(['GET', 'POST'])
def document_list_create(request):
    if request.method == 'GET':
        documents = Document.objects.all().order_by('-date_uploaded')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /api/documents/<id>/ [GET, PUT]
@api_view(['GET', 'PUT'])
def document_detail_update(request, pk):
    document = get_object_or_404(Document, pk=pk)

    if request.method == 'GET':
        serializer = DocumentSerializer(document)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DocumentSerializer(document, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /api/documents/filter/ [GET]
class DocumentFilterView(ListAPIView):
    queryset = Document.objects.all().order_by('-date_uploaded')
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = DocumentFilter

# /api/documents/search/ [GET]
@api_view(['GET'])
def document_search(request):
    query = request.query_params.get('name', '')
    documents = Document.objects.filter(name__icontains=query)
    serializer = DocumentSerializer(documents, many=True)
    return Response(serializer.data)

# /api/documents/request-access/ [POST]
# @api_view(['POST'])
# def request_document_access(request):
#     # dummy handler — replace with logic like emailing admin, creating an AccessRequest model, etc.
#     requested_doc_id = request.data.get('document_id')
#     user_email = request.data.get('email')

#     if requested_doc_id and user_email:
#         # your actual access request logic goes here
#         return Response({'message': 'Access request received.'}, status=status.HTTP_200_OK)
#     return Response({'error': 'Missing document ID or email.'}, status=status.HTTP_400_BAD_REQUEST)

# /api/documents/<id>/grant-access/ [POST]
# @api_view(['POST'])
# def grant_document_access(request, pk):
#     # dummy logic for now
#     admin_user = request.user
#     if not admin_user.is_staff:
#         return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

#     document = get_object_or_404(Document, pk=pk)
#     recipient_email = request.data.get('email')

#     if recipient_email:
#         # simulate granting access (e.g., sending email, toggling permission flag, etc.)
#         return Response({'message': f'Access granted to {recipient_email} for "{document.name}".'})
    
#     return Response({'error': 'Recipient email is required.'}, status=status.HTTP_400_BAD_REQUEST)
