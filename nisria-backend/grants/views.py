from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Grant
from documents.models import Document  # assuming Document is in a separate app

from .serializers import GrantSerializer, DocumentSerializer
from .filters import GrantFilter


@api_view(['GET', 'POST'])
def grant_list_create(request):
    if request.method == 'GET':
        grants = Grant.objects.all()
        serializer = GrantSerializer(grants, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = GrantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(submitted_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def grant_detail(request, id):
    grant = get_object_or_404(Grant, id=id)

    if request.method == 'GET':
        serializer = GrantSerializer(grant)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = GrantSerializer(grant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def grant_filter(request):
    f = GrantFilter(request.GET, queryset=Grant.objects.all())
    serializer = GrantSerializer(f.qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def grant_search(request):
    query = request.GET.get('q', '')
    grants = Grant.objects.filter(
        Q(organization_name__icontains=query) |
        Q(location__icontains=query) |
        Q(notes__icontains=query)
    )
    serializer = GrantSerializer(grants, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def grant_documents(request, id):
    grant = get_object_or_404(Grant, id=id)
    docs = grant.submitted_documents.all()
    serializer = DocumentSerializer(docs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def update_status(request, id):
    grant = get_object_or_404(Grant, id=id)
    new_status = request.data.get('status')

    if new_status not in dict(Grant.STATUS_CHOICES):
        return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    grant.status = new_status
    grant.save()
    return Response({'message': 'Status updated successfully.'})
