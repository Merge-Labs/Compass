from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes # Add permission_classes if needed
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated 

from .models import Division, EducationProgram, MicroFundProgram, RescueProgram, VocationalTrainingProgram
from .serializers import (
    DivisionSerializer,
    EducationProgramSerializer,
    MicroFundProgramSerializer,
    RescueProgramSerializer,
    VocationalTrainingProgramSerializer
)
from .filters import (
    EducationProgramFilter,
    MicroFundProgramFilter,
    RescueProgramFilter,
    VocationalTrainingProgramFilter
)

PROGRAM_METADATA = {
    "education": {
        "model": EducationProgram,
        "serializer": EducationProgramSerializer,
        "filterset_class": EducationProgramFilter,
        "allowed_division_urls": ["nisria"], # URL part for division
        "db_division_map": {"nisria": "nisria"}, # URL division part -> DB Division.name
        "search_fields": ['name', 'student_name', 'description'], # For Q object search
    },
    "microfund": {
        "model": MicroFundProgram,
        "serializer": MicroFundProgramSerializer,
        "filterset_class": MicroFundProgramFilter,
        "allowed_division_urls": ["nisria"],
        "db_division_map": {"nisria": "nisria"},
        "search_fields": ['name', 'person_name', 'description', 'chama_group'],
    },
    "rescue": {
        "model": RescueProgram,
        "serializer": RescueProgramSerializer,
        "filterset_class": RescueProgramFilter,
        "allowed_division_urls": ["nisria"],
        "db_division_map": {"nisria": "nisria"},
        "search_fields": ['name', 'child_name', 'description', 'place_found'],
    },
    "vocational": {
        "model": VocationalTrainingProgram,
        "serializer": VocationalTrainingProgramSerializer,
        "filterset_class": VocationalTrainingProgramFilter,
        "allowed_division_urls": ["maisha"],
        "db_division_map": {"maisha": "maisha"},
        "search_fields": ['name', 'trainer_name', 'trainee_name', 'description'],
    }
}

def indexTest(request):
    return JsonResponse({"message": "API endpoints working in Divisions app"})


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


def _get_program_meta_and_division(division_name_url, program_type_url):
    program_type_url_lower = program_type_url.lower()
    meta = PROGRAM_METADATA.get(program_type_url_lower)
    if not meta:
        raise Http404(f"Program type '{program_type_url}' not configured.")

    division_name_url_lower = division_name_url.lower()
    if division_name_url_lower not in meta["allowed_division_urls"]:
        raise Http404(f"Program type '{program_type_url}' is not allowed under division URL '{division_name_url}'.")

    db_division_name = meta["db_division_map"].get(division_name_url_lower)
    if not db_division_name:
        raise Http404(f"Internal configuration error: No database mapping for division URL '{division_name_url}'.")

    try:
        division = Division.objects.get(name=db_division_name)
        return meta, division
    except Division.DoesNotExist:
        raise Http404(f"Division '{db_division_name}' (mapped from URL '{division_name_url}') not found.")

# --- Division Views ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def division_list_create(request):
    if request.method == 'GET':
        divisions = Division.objects.all()
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(divisions, request)
        serializer = DivisionSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        serializer = DivisionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def division_detail_view(request, pk):
    division = get_object_or_404(Division, pk=pk)

    if request.method == 'GET':
        serializer = DivisionSerializer(division, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DivisionSerializer(division, data=request.data, partial=False, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        serializer = DivisionSerializer(division, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        division.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- Generic Program Logic Handlers ---
def _base_program_list_logic(request, division_name_url, program_type_url, filter_logic=False, search_logic=False):
    meta, division = _get_program_meta_and_division(division_name_url, program_type_url)
    queryset = meta["model"].objects.filter(division=division)

    if filter_logic and meta["filterset_class"]:
        filterset = meta["filterset_class"](request.GET, queryset=queryset)
        queryset = filterset.qs

    if search_logic:
        search_term = request.query_params.get('q', None) # Common query param for search
        if search_term and meta["search_fields"]:
            search_query = Q()
            for field in meta["search_fields"]:
                search_query |= Q(**{f"{field}__icontains": search_term})
            queryset = queryset.filter(search_query)

    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer_instance = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer_instance.data)


# --- Specific Program Endpoint Views ---

def _program_list_create_view(request, division_name_url, program_type_url):
    meta, division = _get_program_meta_and_division(division_name_url, program_type_url)

    if request.method == 'GET':
        return _base_program_list_logic(request, division_name_url, program_type_url)

    elif request.method == 'POST':
        serializer_instance = meta["serializer"](data=request.data, context={'request': request})
        if serializer_instance.is_valid():
            serializer_instance.save(division=division) # Ensure division is set
            return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
        return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)

def _program_detail_view(request, division_name_url, program_type_url, pk):
    meta, division = _get_program_meta_and_division(division_name_url, program_type_url)
    program_instance = get_object_or_404(meta["model"], pk=pk, division=division)

    if request.method == 'GET':
        serializer_instance = meta["serializer"](program_instance, context={'request': request})
        return Response(serializer_instance.data)

    elif request.method == 'PUT':
        # For PUT, we expect a full update, so partial=False.
        # The serializer will require all fields unless they are explicitly not required.
        serializer_instance = meta["serializer"](
            program_instance,
            data=request.data,
            partial=False, # Explicitly False for PUT
            context={'request': request}
        )
        if serializer_instance.is_valid():
            serializer_instance.save()
            return Response(serializer_instance.data)
        return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        # For PATCH, we expect a partial update, so partial=True.
        # The serializer will only validate and update the fields provided in the request.
        serializer_instance = meta["serializer"](
            program_instance,
            data=request.data,
            partial=True, # Explicitly True for PATCH
            context={'request': request}
        )
        if serializer_instance.is_valid():
            serializer_instance.save()
            return Response(serializer_instance.data)
        return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        program_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Education Program Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def education_program_list_create(request, division_name):
    return _program_list_create_view(request, division_name, "education")

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def education_program_detail(request, division_name, pk):
    return _program_detail_view(request, division_name, "education", pk)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def education_program_filter(request, division_name):
    return _base_program_list_logic(request, division_name, "education", filter_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def education_program_search(request, division_name):
    return _base_program_list_logic(request, division_name, "education", search_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def education_program_get_details(request, division_name, pk): # Essentially a retrieve operation
    meta, division = _get_program_meta_and_division(division_name, "education")
    program_instance = get_object_or_404(meta["model"], pk=pk, division=division)
    serializer_instance = meta["serializer"](program_instance, context={'request': request})
    return Response(serializer_instance.data)

# Similar view functions would be created for MicroFund, Rescue, and Vocational programs
# For brevity, I'm showing the pattern with Education. You'd replicate these 5 FBVs for each program type.

# --- MicroFund Program Views ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def microfund_program_list_create(request, division_name): 
    return _program_list_create_view(request, division_name, "microfund")

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def microfund_program_detail(request, division_name, pk): 
    return _program_detail_view(request, division_name, "microfund", pk)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def microfund_program_filter(request, division_name): 
    return _base_program_list_logic(request, division_name, "microfund", filter_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def microfund_program_search(request, division_name): 
    return _base_program_list_logic(request, division_name, "microfund", search_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def microfund_program_get_details(request, division_name, pk):
    meta, division = _get_program_meta_and_division(division_name, "microfund")
    instance = get_object_or_404(meta["model"], pk=pk, division=division)
    return Response(meta["serializer"](instance, context={'request': request}).data)

# --- Rescue Program Views ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def rescue_program_list_create(request, division_name): 
    return _program_list_create_view(request, division_name, "rescue")

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def rescue_program_detail(request, division_name, pk): 
    return _program_detail_view(request, division_name, "rescue", pk)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def rescue_program_filter(request, division_name): 
    return _base_program_list_logic(request, division_name, "rescue", filter_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def rescue_program_search(request, division_name): 
    return _base_program_list_logic(request, division_name, "rescue", search_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def rescue_program_get_details(request, division_name, pk):
    meta, division = _get_program_meta_and_division(division_name, "rescue")
    instance = get_object_or_404(meta["model"], pk=pk, division=division)
    return Response(meta["serializer"](instance, context={'request': request}).data)

# --- Vocational Program Views ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def vocational_program_list_create(request, division_name): 
    return _program_list_create_view(request, division_name, "vocational")

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def vocational_program_detail(request, division_name, pk): 
    return _program_detail_view(request, division_name, "vocational", pk)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def vocational_program_filter(request, division_name): 
    return _base_program_list_logic(request, division_name, "vocational", filter_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def vocational_program_search(request, division_name): 
    return _base_program_list_logic(request, division_name, "vocational", search_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def vocational_program_get_details(request, division_name, pk):
    meta, division = _get_program_meta_and_division(division_name, "vocational")
    instance = get_object_or_404(meta["model"], pk=pk, division=division)
    return Response(meta["serializer"](instance, context={'request': request}).data)