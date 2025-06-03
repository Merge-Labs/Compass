from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils import timezone
from accounts.permissions import IsSuperAdmin
from django.contrib.contenttypes.models import ContentType
from core.models import RecycleBinItem

from .models import (
    Division, Program,
    EducationProgramDetail, MicroFundProgramDetail, RescueProgramDetail,
    VocationalTrainingProgramTrainerDetail, VocationalTrainingProgramTraineeDetail
)
from .serializers import (
    DivisionSerializer,
    ProgramSerializer,
    EducationProgramDetailSerializer,
    MicroFundProgramDetailSerializer,
    RescueProgramDetailSerializer,
    VocationalTrainingProgramTrainerDetailSerializer,
    VocationalTrainingProgramTraineeDetailSerializer
)
from .filters import (
    DivisionFilter,
    ProgramFilter,
    EducationProgramDetailFilter,
    MicroFundProgramDetailFilter,
    RescueProgramDetailFilter,
    VocationalTrainingProgramTrainerDetailFilter,
    VocationalTrainingProgramTraineeDetailFilter
)

PROGRAM_DETAIL_METADATA = {
    "education": {
        "model": EducationProgramDetail,
        "serializer": EducationProgramDetailSerializer,
        "filterset_class": EducationProgramDetailFilter,
        "allowed_division_urls": ["nisria"], 
        "db_division_map": {"nisria": "nisria"}, 
        "search_fields": ['student_name', 'education_level', 'student_location', 'school_associated'],
        "program_name": "education", 
    },
    "microfund": {
        "model": MicroFundProgramDetail,
        "serializer": MicroFundProgramDetailSerializer,
        "filterset_class": MicroFundProgramDetailFilter,
        "allowed_division_urls": ["nisria"],
        "db_division_map": {"nisria": "nisria"},
        "program_name": "microfund", 
        "search_fields": ['person_name', 'chama_group', 'location'],
    },
    "rescue": {
        "model": RescueProgramDetail,
        "serializer": RescueProgramDetailSerializer,
        "filterset_class": RescueProgramDetailFilter,
        "allowed_division_urls": ["nisria"],
        "db_division_map": {"nisria": "nisria"},
        "program_name": "rescue",
        "search_fields": ['child_name', 'place_found', 'notes'],
    },
    "vocational": {
        # This metadata entry can be for the "vocational" Program itself,
        # or you might not need it if trainers/trainees are always accessed via specific URLs.
        # For now, let's assume the generic /<division_name>/vocational/ endpoints
        # will list/filter trainees across all trainers of that vocational program.
        "model": VocationalTrainingProgramTraineeDetail,
        "serializer": VocationalTrainingProgramTraineeDetailSerializer,
        "filterset_class": VocationalTrainingProgramTraineeDetailFilter,
        "allowed_division_urls": ["maisha"],
        "db_division_map": {"maisha": "maisha"},
        "program_name": "vocational", 
        "search_fields": ['trainee_name', 'trainee_association', 'trainee_email'],
    },
    "vocational-trainer": { 
        "model": VocationalTrainingProgramTrainerDetail,
        "serializer": VocationalTrainingProgramTrainerDetailSerializer,
        "filterset_class": VocationalTrainingProgramTrainerDetailFilter, 
        "allowed_division_urls": ["maisha"],
        "db_division_map": {"maisha": "maisha"},
        "program_name": "vocational", 
        "search_fields": ['trainer_name', 'trainer_association', 'trainer_email'],
    }
}

@swagger_auto_schema(
    method='get',
    operation_description="A simple test endpoint for the divisions app.",
    responses={
        200: openapi.Response(description="Success message", examples={"application/json": {"message": "API endpoints working in Divisions app"}})
    }
)
@api_view(['GET'])
def indexTest(request):
    return JsonResponse({"message": "API endpoints working in Divisions app"})


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


def _get_program_detail_meta_and_program(division_name_url, program_type_url):
    """
    Retrieves metadata for a specific program detail type and the associated Program object.
    """
    program_type_url_lower = program_type_url.lower()
    meta = PROGRAM_DETAIL_METADATA.get(program_type_url_lower)
    if not meta:
        raise Http404(f"Program type '{program_type_url}' not configured.")

    division_name_url_lower = division_name_url.lower()
    if division_name_url_lower not in meta["allowed_division_urls"]:
        raise Http404(f"Program type '{program_type_url_lower}' is not allowed under division URL '{division_name_url_lower}'.")

    db_division_name = meta["db_division_map"].get(division_name_url_lower)
    if not db_division_name: 
        raise Http404(f"Internal configuration error: No database mapping for division URL '{division_name_url}'.")

    try:
        division = Division.objects.get(name=db_division_name)
    except Division.DoesNotExist:
        raise Http404(f"Division '{db_division_name}' (mapped from URL '{division_name_url}') not found.")
        
    # Use the 'program_name' from metadata if available, otherwise default to the URL segment
    program_name_in_db = meta.get("program_name", program_type_url_lower)

    # Find the specific Program object based on division and the determined program name
    try:
        program = Program.objects.get(division=division, name=program_name_in_db)
        return meta, program 
    except Program.DoesNotExist:
        raise Http404(f"Program '{program_name_in_db}' not found in division '{db_division_name}'.")

# --- Division Views ---
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of divisions.",
    responses={
        200: DivisionSerializer(many=True),
        401: 'Unauthorized'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new division.",
    request_body=DivisionSerializer,
    responses={
        201: DivisionSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        # Add 403 if specific permissions are checked internally beyond IsAuthenticated
    }
)
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

@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a specific division by its ID.",
    responses={
        200: DivisionSerializer,
        401: 'Unauthorized',
        404: 'Division Not Found'
    }
)
@swagger_auto_schema(
    method='put',
    operation_description="Update a specific division by its ID.",
    request_body=DivisionSerializer,
    responses={
        200: DivisionSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Division Not Found'
    }
)
@swagger_auto_schema(
    method='patch',
    operation_description="Partially update a specific division by its ID.",
    request_body=DivisionSerializer,
    responses={
        200: DivisionSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Division Not Found'
    }
)
@swagger_auto_schema(
    method='delete',
    operation_description="Delete a specific division by its ID.",
    responses={
        204: 'No Content - Division deleted successfully',
        401: 'Unauthorized',
        404: 'Division Not Found'
    }
)
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

# --- Program Definition Views ---
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of programs.",
    responses={
        200: ProgramSerializer(many=True),
        401: 'Unauthorized'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new program definition.",
    request_body=ProgramSerializer,
    responses={
        201: ProgramSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        # Add 403 if specific permissions are checked internally
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def program_list_create(request):
    if request.method == 'GET':
        programs = Program.objects.all()
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(programs, request)
        serializer = ProgramSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        serializer = ProgramSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a specific program definition by its ID.",
    responses={
        200: ProgramSerializer,
        401: 'Unauthorized',
        404: 'Program Not Found'
    }
)
@swagger_auto_schema(
    method='put',
    operation_description="Update a specific program definition by its ID.",
    request_body=ProgramSerializer,
    responses={
        200: ProgramSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Program Not Found'
    }
)
@swagger_auto_schema(
    method='patch',
    operation_description="Partially update a specific program definition by its ID.",
    request_body=ProgramSerializer,
    responses={
        200: ProgramSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Program Not Found'
    }
)
@swagger_auto_schema(
    method='delete',
    operation_description="Delete a specific program definition by its ID.",
    responses={
        204: 'No Content - Program deleted successfully',
        401: 'Unauthorized',
        404: 'Program Not Found'
    }
)
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def program_detail_view(request, pk):
    program = get_object_or_404(Program, pk=pk)
    serializer = ProgramSerializer(program, data=request.data, partial=request.method == 'PATCH', context={'request': request})
    if request.method == 'DELETE':
        program.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def _base_program_detail_list_logic(request, division_name_url, program_type_url, filter_logic=False, search_logic=False):
    meta, program = _get_program_detail_meta_and_program(division_name_url, program_type_url)
    # This logic assumes the detail model has a direct ForeignKey to Program.
    queryset = meta["model"].objects.filter(program=program)

    if filter_logic and meta["filterset_class"]:
        filterset = meta["filterset_class"](request.GET, queryset=queryset)
        queryset = filterset.qs

    if search_logic:
        search_term = request.query_params.get('q', None) 
        if search_term and meta["search_fields"]:
            search_query = Q()
            for field in meta["search_fields"]:
                search_query |= Q(**{f"{field}__icontains": search_term})
            queryset = queryset.filter(search_query)
            
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer_instance = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer_instance.data)

# --- Generic Program Detail Instance Logic Handlers ---
# --- Specific Program Endpoint Views ---

def _program_list_create_view(request, division_name_url, program_type_url):
    # This function now correctly gets the detail_meta and the parent program instance
    meta, program_instance = _get_program_detail_meta_and_program(division_name_url, program_type_url)

    if request.method == 'GET':
        # _base_program_detail_list_logic internally calls _get_program_detail_meta_and_program
        return _base_program_detail_list_logic(request, division_name_url, program_type_url)
    elif request.method == 'POST':
        serializer_instance = meta["serializer"](data=request.data, context={'request': request})
        if serializer_instance.is_valid():
            serializer_instance.save(
                program=program_instance, 
                created_by=request.user, 
                updated_by=request.user 
            )
            return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
        return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)        

def _program_detail_view(request, division_name_url, program_type_url, pk):
    meta, program_instance = _get_program_detail_meta_and_program(division_name_url, program_type_url)
    # Fetch the specific detail instance belonging to the program_instance
    detail_instance = get_object_or_404(meta["model"], pk=pk, program=program_instance)

    if request.method == 'GET':
        serializer = meta["serializer"](detail_instance, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = meta["serializer"](
            detail_instance,
            data=request.data,
            partial=False, 
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(updated_by=request.user) 
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        serializer = meta["serializer"](
            detail_instance,
            data=request.data,
            partial=True, 
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(updated_by=request.user) 
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        detail_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Education Program Views
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of Education Program Details for the specified division (e.g., 'nisria').",
    responses={
        200: EducationProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Education Program definition not found.'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new Education Program Detail for the specified division.",
    request_body=EducationProgramDetailSerializer,
    responses={
        201: EducationProgramDetailSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Division or Education Program definition not found.'
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def education_program_list_create(request, division_name):
    return _program_list_create_view(request, division_name, "education")

@swagger_auto_schema(method='get', operation_description="Retrieve a specific Education Program Detail.", responses={200: EducationProgramDetailSerializer, 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='put', operation_description="Update an Education Program Detail.", request_body=EducationProgramDetailSerializer, responses={200: EducationProgramDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='patch', operation_description="Partially update an Education Program Detail.", request_body=EducationProgramDetailSerializer, responses={200: EducationProgramDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='delete', operation_description="Delete an Education Program Detail.", responses={204: 'No Content', 401: 'Unauthorized', 404: 'Not Found'})
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def education_program_detail(request, division_name, pk):
    return _program_detail_view(request, division_name, "education", pk)

@swagger_auto_schema(
    method='get',
    operation_description="Search Education Program Details for the specified division. Use 'q' query parameter for search term.",
    manual_parameters=[openapi.Parameter('q', openapi.IN_QUERY, description="Search term for student name, education level, etc.", type=openapi.TYPE_STRING)],
    responses={
        200: EducationProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Education Program definition not found.'
    }
)
@api_view(['GET']) 
@permission_classes([IsAuthenticated]) 
def education_program_search(request, division_name):
    return _base_program_detail_list_logic(request, division_name, "education", search_logic=True)

@swagger_auto_schema(
    method='get',
    operation_description="Filter Education Program Details for the specified division. Refer to EducationProgramDetailFilter for available query parameters.",
    responses={
        200: EducationProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Education Program definition not found.'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def education_program_filter(request, division_name):
    return _base_program_detail_list_logic(request, division_name, "education", filter_logic=True)

# --- MicroFund Program Views ---
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of MicroFund Program Details for the specified division (e.g., 'nisria').",
    responses={
        200: MicroFundProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or MicroFund Program definition not found.'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new MicroFund Program Detail for the specified division.",
    request_body=MicroFundProgramDetailSerializer,
    responses={
        201: MicroFundProgramDetailSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Division or MicroFund Program definition not found.'
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def microfund_program_list_create(request, division_name): 
    return _program_list_create_view(request, division_name, "microfund")    

@swagger_auto_schema(method='get', operation_description="Retrieve a specific MicroFund Program Detail.", responses={200: MicroFundProgramDetailSerializer, 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='put', operation_description="Update a MicroFund Program Detail.", request_body=MicroFundProgramDetailSerializer, responses={200: MicroFundProgramDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='patch', operation_description="Partially update a MicroFund Program Detail.", request_body=MicroFundProgramDetailSerializer, responses={200: MicroFundProgramDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='delete', operation_description="Delete a MicroFund Program Detail.", responses={204: 'No Content', 401: 'Unauthorized', 404: 'Not Found'})
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def microfund_program_detail(request, division_name, pk): 
    return _program_detail_view(request, division_name, "microfund", pk)

@swagger_auto_schema(
    method='get',
    operation_description="Filter MicroFund Program Details for the specified division. Refer to MicroFundProgramDetailFilter for available query parameters.",
    responses={
        200: MicroFundProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or MicroFund Program definition not found.'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def microfund_program_filter(request, division_name): 
    return _base_program_detail_list_logic(request, division_name, "microfund", filter_logic=True)

@swagger_auto_schema(
    method='get',
    operation_description="Search MicroFund Program Details for the specified division. Use 'q' query parameter for search term.",
    manual_parameters=[openapi.Parameter('q', openapi.IN_QUERY, description="Search term for person name, chama group, etc.", type=openapi.TYPE_STRING)],
    responses={
        200: MicroFundProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or MicroFund Program definition not found.'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def microfund_program_search(request, division_name): 
    return _base_program_detail_list_logic(request, division_name, "microfund", search_logic=True)

# --- Rescue Program Views ---
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of Rescue Program Details for the specified division (e.g., 'nisria').",
    responses={
        200: RescueProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Rescue Program definition not found.'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new Rescue Program Detail for the specified division.",
    request_body=RescueProgramDetailSerializer,
    responses={
        201: RescueProgramDetailSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Division or Rescue Program definition not found.'
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def rescue_program_list_create(request, division_name): 
    return _program_list_create_view(request, division_name, "rescue")

@swagger_auto_schema(method='get', operation_description="Retrieve a specific Rescue Program Detail.", responses={200: RescueProgramDetailSerializer, 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='put', operation_description="Update a Rescue Program Detail.", request_body=RescueProgramDetailSerializer, responses={200: RescueProgramDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='patch', operation_description="Partially update a Rescue Program Detail.", request_body=RescueProgramDetailSerializer, responses={200: RescueProgramDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='delete', operation_description="Delete a Rescue Program Detail.", responses={204: 'No Content', 401: 'Unauthorized', 404: 'Not Found'})
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def rescue_program_detail(request, division_name, pk): 
    return _program_detail_view(request, division_name, "rescue", pk)

@swagger_auto_schema(
    method='get',
    operation_description="Filter Rescue Program Details for the specified division. Refer to RescueProgramDetailFilter for available query parameters.",
    responses={
        200: RescueProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Rescue Program definition not found.'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def rescue_program_filter(request, division_name): 
    return _base_program_detail_list_logic(request, division_name, "rescue", filter_logic=True)

@swagger_auto_schema(
    method='get',
    operation_description="Search Rescue Program Details for the specified division. Use 'q' query parameter for search term.",
    manual_parameters=[openapi.Parameter('q', openapi.IN_QUERY, description="Search term for child name, place found, etc.", type=openapi.TYPE_STRING)],
    responses={
        200: RescueProgramDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Rescue Program definition not found.'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def rescue_program_search(request, division_name): 
    return _base_program_detail_list_logic(request, division_name, "rescue", search_logic=True)

# --- Base Logic for Vocational Trainee Listing/Filtering/Searching ---
def _base_trainee_list_logic(request, division_name_url, program_type_url, filter_logic=False, search_logic=False):
    """
    Retrieves and filters/searches VocationalTrainingProgramTraineeDetail instances
    for a given vocational program within a division.
    """
    # This function is specifically for the 'vocational' program type (trainees)
    if program_type_url.lower() != "vocational":
        raise Http404("This logic is only for vocational program trainees.")

    meta = PROGRAM_DETAIL_METADATA.get("vocational") 
    if not meta: # Should not happen if "vocational" is in metadata
         raise Http404("Vocational program trainee metadata not found.")

    # Get the parent "vocational" Program instance
    # _get_program_detail_meta_and_program will handle division and program existence checks
    meta_check, vocational_program = _get_program_detail_meta_and_program(division_name_url, program_type_url)

    # Filter trainees by trainers belonging to this vocational program
    queryset = VocationalTrainingProgramTraineeDetail.objects.filter(trainer__program=vocational_program)

    if filter_logic and meta["filterset_class"]:
        # Use the TraineeDetailFilter, which can filter by trainer__program etc.
        filterset = meta["filterset_class"](request.GET, queryset=queryset)
        queryset = filterset.qs

    if search_logic:
        search_term = request.query_params.get('q', None)
        if search_term and meta["search_fields"]:
            search_query = Q()
            for field in meta["search_fields"]:
                # Search fields are on the TraineeDetail model
                search_query |= Q(**{f"{field}__icontains": search_term})
            queryset = queryset.filter(search_query)

    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer_instance = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer_instance.data)

# --- Vocational Program Trainer Views ---
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of Vocational Program Trainers for the specified division (e.g., 'maisha').",
    responses={
        200: VocationalTrainingProgramTrainerDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Vocational Program definition not found.'
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new Vocational Program Trainer for the specified division.",
    request_body=VocationalTrainingProgramTrainerDetailSerializer,
    responses={
        201: VocationalTrainingProgramTrainerDetailSerializer,
        400: 'Bad Request - Invalid data',
        401: 'Unauthorized',
        404: 'Division or Vocational Program definition not found.'
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vocational_trainer_list_create(request, division_name):
    # Uses "vocational-trainer" key from PROGRAM_DETAIL_METADATA
    # This view uses the generic _program_list_create_view because TrainerDetail links directly to Program
    return _program_list_create_view(request, division_name, "vocational-trainer")

@swagger_auto_schema(method='get', operation_description="Retrieve a specific Vocational Program Trainer.", responses={200: VocationalTrainingProgramTrainerDetailSerializer, 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='put', operation_description="Update a Vocational Program Trainer.", request_body=VocationalTrainingProgramTrainerDetailSerializer, responses={200: VocationalTrainingProgramTrainerDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='patch', operation_description="Partially update a Vocational Program Trainer.", request_body=VocationalTrainingProgramTrainerDetailSerializer, responses={200: VocationalTrainingProgramTrainerDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='delete', operation_description="Delete a Vocational Program Trainer.", responses={204: 'No Content', 401: 'Unauthorized', 404: 'Not Found'})
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def vocational_trainer_detail(request, division_name, pk):
    # Uses "vocational-trainer" key
    # This view uses the generic _program_detail_view because TrainerDetail links directly to Program
    return _program_detail_view(request, division_name, "vocational-trainer", pk)

# --- Vocational Program Trainee Views (Nested under Trainer) ---
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a paginated list of Vocational Program Trainees for a specific trainer within a division.",
    responses={200: VocationalTrainingProgramTraineeDetailSerializer(many=True), 401: 'Unauthorized', 404: 'Division, Program, or Trainer not found.'}
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new Vocational Program Trainee for a specific trainer.",
    request_body=VocationalTrainingProgramTraineeDetailSerializer,
    responses={201: VocationalTrainingProgramTraineeDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Division, Program, or Trainer not found.'}
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vocational_trainee_list_create(request, division_name, trainer_pk):
    try:
        division = Division.objects.get(name=division_name.lower())
    except Division.DoesNotExist:
        raise Http404(f"Division '{division_name}' not found.")
    if division.name != "maisha": # Or check against allowed_division_urls
        raise Http404("Vocational trainees are only under Maisha division.")

    try:
        vocational_program = Program.objects.get(division=division, name="vocational")
    except Program.DoesNotExist:
        raise Http404("Vocational program definition not found in Maisha division.")

    trainer_instance = get_object_or_404(VocationalTrainingProgramTrainerDetail, pk=trainer_pk, program=vocational_program)

    if request.method == 'GET':
        trainees = VocationalTrainingProgramTraineeDetail.objects.filter(trainer=trainer_instance)
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(trainees, request)
        serializer = VocationalTrainingProgramTraineeDetailSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        serializer = VocationalTrainingProgramTraineeDetailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(
                trainer=trainer_instance, 
                created_by=request.user,  
                updated_by=request.user   
            ) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='get', operation_description="Retrieve a specific Vocational Program Trainee.", responses={200: VocationalTrainingProgramTraineeDetailSerializer, 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='put', operation_description="Update a Vocational Program Trainee.", request_body=VocationalTrainingProgramTraineeDetailSerializer, responses={200: VocationalTrainingProgramTraineeDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='patch', operation_description="Partially update a Vocational Program Trainee.", request_body=VocationalTrainingProgramTraineeDetailSerializer, responses={200: VocationalTrainingProgramTraineeDetailSerializer, 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found'})
@swagger_auto_schema(method='delete', operation_description="Delete a Vocational Program Trainee.", responses={204: 'No Content', 401: 'Unauthorized', 404: 'Not Found'})
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def vocational_trainee_detail(request, division_name, trainer_pk, pk):
    try:
        division = Division.objects.get(name=division_name.lower())
        vocational_program = Program.objects.get(division=division, name="vocational")
        trainer_instance = get_object_or_404(VocationalTrainingProgramTrainerDetail, pk=trainer_pk, program=vocational_program)
    except (Division.DoesNotExist, Program.DoesNotExist):
        raise Http404("Invalid division or vocational program for trainer.")

    trainee_instance = get_object_or_404(VocationalTrainingProgramTraineeDetail, pk=pk, trainer=trainer_instance)

    if request.method == 'GET':
        serializer = VocationalTrainingProgramTraineeDetailSerializer(trainee_instance, context={'request': request})
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']:
        serializer = VocationalTrainingProgramTraineeDetailSerializer(trainee_instance, data=request.data, partial=request.method == 'PATCH', context={'request': request})
        if serializer.is_valid():
            serializer.save(updated_by=request.user) 
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        trainee_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- General Vocational Trainee Views (Not nested, for filtering/searching across all trainers of a program) ---
# These are your existing vocational views, they will now effectively manage trainees
# across all trainers of the "vocational" program in the "maisha" division.

@swagger_auto_schema(
    method='get',
    operation_description="Filter Vocational Program Trainees across all trainers for the specified division (e.g., 'maisha'). Refer to VocationalTrainingProgramTraineeDetailFilter for parameters.",
    responses={
        200: VocationalTrainingProgramTraineeDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Vocational Program definition not found.'
    }
)
@api_view(['GET']) # Filters VocationalTrainingProgramTraineeDetail
@permission_classes([IsAuthenticated])
def vocational_program_filter(request, division_name):
    return _base_trainee_list_logic(request, division_name, "vocational", filter_logic=True)

@swagger_auto_schema(
    method='get',
    operation_description="Search Vocational Program Trainees across all trainers for the specified division (e.g., 'maisha'). Use 'q' query parameter.",
    manual_parameters=[openapi.Parameter('q', openapi.IN_QUERY, description="Search term for trainee name, association, etc.", type=openapi.TYPE_STRING)],
    responses={
        200: VocationalTrainingProgramTraineeDetailSerializer(many=True),
        401: 'Unauthorized',
        404: 'Division or Vocational Program definition not found.'
    }
)
@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def vocational_program_search(request, division_name):
    return _base_trainee_list_logic(request, division_name, "vocational", search_logic=True)

# --- SOFT DELETE, RESTORE, RECYCLE BIN, PERMANENT DELETE FOR DIVISION ---

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def division_soft_delete(request, pk):
    division = get_object_or_404(Division, pk=pk) # Ensures it's not already soft-deleted by default manager
    division.soft_delete(user=request.user)
    return Response({'detail': 'Division moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def division_restore(request, pk):
    division = Division.all_objects.filter(pk=pk, is_deleted=True).first()
    if not division:
        return Response({'detail': 'Not found in recycle bin.'}, status=status.HTTP_404_NOT_FOUND)
    division.restore()
    return Response({'detail': 'Division restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def division_permanent_delete(request, pk):
    division = Division.all_objects.filter(pk=pk, is_deleted=True).first()
    if not division:
        return Response({'detail': 'Not found in recycle bin.'}, status=status.HTTP_404_NOT_FOUND)
    
    division_pk = division.pk
    division.delete(user=request.user) # SoftDeleteModel's delete handles hard delete for super_admin if is_deleted=True

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(Division),
        object_id_uuid=division_pk
    ).delete()
    return Response({'detail': 'Division permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def division_recycle_bin(request):
    divisions = Division.all_objects.filter(is_deleted=True).order_by('-deleted_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(divisions, request)
    serializer = DivisionSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

# --- SOFT DELETE, RESTORE, RECYCLE BIN, PERMANENT DELETE FOR PROGRAM ---

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def program_soft_delete(request, pk):
    program = get_object_or_404(Program, pk=pk)
    program.soft_delete(user=request.user)
    return Response({'detail': 'Program moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def program_restore(request, pk):
    program = Program.all_objects.filter(pk=pk, is_deleted=True).first()
    if not program:
        return Response({'detail': 'Not found in recycle bin.'}, status=status.HTTP_404_NOT_FOUND)
    program.restore()
    return Response({'detail': 'Program restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def program_permanent_delete(request, pk):
    program = Program.all_objects.filter(pk=pk, is_deleted=True).first()
    if not program:
        return Response({'detail': 'Not found in recycle bin.'}, status=status.HTTP_404_NOT_FOUND)

    program_pk = program.pk
    program.delete(user=request.user)

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(Program),
        object_id_uuid=program_pk
    ).delete()
    return Response({'detail': 'Program permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def program_recycle_bin(request):
    programs = Program.all_objects.filter(is_deleted=True).order_by('-deleted_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(programs, request)
    serializer = ProgramSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)




# --- SOFT DELETE, RESTORE, RECYCLE BIN, PERMANENT DELETE FOR PROGRAM DETAILS ---

# --- Education Program Detail ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def education_program_soft_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "education")
    instance = get_object_or_404(meta["model"], pk=pk, program=program)
    instance.soft_delete(user=request.user)
    return Response({'detail': 'Education program detail moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def education_program_restore(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "education")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)
    instance.restore()
    return Response({'detail': 'Education program detail restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def education_program_permanent_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "education")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)
    
    instance_pk = instance.pk
    instance.delete(user=request.user)

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(meta["model"]),
        object_id_uuid=instance_pk
    ).delete()
    return Response({'detail': 'Education program detail permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def education_program_recycle_bin(request, division_name):
    meta, program = _get_program_detail_meta_and_program(division_name, "education")
    queryset = meta["model"].all_objects.filter(program=program, is_deleted=True).order_by('-deleted_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

# --- MicroFund Program Detail ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def microfund_program_soft_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "microfund")
    instance = get_object_or_404(meta["model"], pk=pk, program=program)
    instance.soft_delete(user=request.user)
    return Response({'detail': 'MicroFund program detail moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def microfund_program_restore(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "microfund")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)
    instance.restore()
    return Response({'detail': 'MicroFund program detail restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def microfund_program_permanent_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "microfund")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)

    instance_pk = instance.pk
    instance.delete(user=request.user)

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(meta["model"]),
        object_id_uuid=instance_pk
    ).delete()
    return Response({'detail': 'MicroFund program detail permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def microfund_program_recycle_bin(request, division_name):
    meta, program = _get_program_detail_meta_and_program(division_name, "microfund")
    queryset = meta["model"].all_objects.filter(program=program, is_deleted=True).order_by('-deleted_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

# --- Rescue Program Detail ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def rescue_program_soft_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "rescue")
    instance = get_object_or_404(meta["model"], pk=pk, program=program)
    instance.soft_delete(user=request.user)
    return Response({'detail': 'Rescue program detail moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def rescue_program_restore(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "rescue")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)
    instance.restore()
    return Response({'detail': 'Rescue program detail restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def rescue_program_permanent_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "rescue")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)

    instance_pk = instance.pk
    instance.delete(user=request.user)

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(meta["model"]),
        object_id_uuid=instance_pk
    ).delete()
    return Response({'detail': 'Rescue program detail permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def rescue_program_recycle_bin(request, division_name):
    meta, program = _get_program_detail_meta_and_program(division_name, "rescue")
    queryset = meta["model"].all_objects.filter(program=program, is_deleted=True).order_by('-deleted_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

# --- Vocational Trainer Detail ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def vocational_trainer_soft_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "vocational-trainer")
    instance = get_object_or_404(meta["model"], pk=pk, program=program)
    instance.soft_delete(user=request.user)
    return Response({'detail': 'Vocational trainer moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def vocational_trainer_restore(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "vocational-trainer")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)
    instance.restore()
    return Response({'detail': 'Vocational trainer restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def vocational_trainer_permanent_delete(request, division_name, pk):
    meta, program = _get_program_detail_meta_and_program(division_name, "vocational-trainer")
    instance = meta["model"].all_objects.filter(pk=pk, program=program, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this program.'}, status=status.HTTP_404_NOT_FOUND)

    instance_pk = instance.pk
    instance.delete(user=request.user)

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(meta["model"]),
        object_id_uuid=instance_pk
    ).delete()
    return Response({'detail': 'Vocational trainer permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def vocational_trainer_recycle_bin(request, division_name):
    meta, program = _get_program_detail_meta_and_program(division_name, "vocational-trainer")
    queryset = meta["model"].all_objects.filter(program=program, is_deleted=True).order_by('-deleted_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = meta["serializer"](page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

# --- Vocational Trainee Detail ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def vocational_trainee_soft_delete(request, division_name, trainer_pk, pk):
    # Find division, program, trainer, then trainee
    division = get_object_or_404(Division, name=division_name.lower())
    program = get_object_or_404(Program, division=division, name="vocational")
    trainer = get_object_or_404(VocationalTrainingProgramTrainerDetail.objects.select_related('program__division'), pk=trainer_pk, program=program)
    instance = get_object_or_404(VocationalTrainingProgramTraineeDetail, pk=pk, trainer=trainer)
    instance.soft_delete(user=request.user)
    return Response({'detail': 'Vocational trainee moved to recycle bin.'}, status=204)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def vocational_trainee_restore(request, division_name, trainer_pk, pk):
    division = get_object_or_404(Division, name=division_name.lower())
    program = get_object_or_404(Program, division=division, name="vocational")
    trainer = get_object_or_404(VocationalTrainingProgramTrainerDetail.all_objects.select_related('program__division'), pk=trainer_pk, program=program) # trainer might be soft-deleted
    instance = VocationalTrainingProgramTraineeDetail.all_objects.filter(pk=pk, trainer=trainer, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this trainer.'}, status=status.HTTP_404_NOT_FOUND)
    instance.restore()
    return Response({'detail': 'Vocational trainee restored.'})

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def vocational_trainee_permanent_delete(request, division_name, trainer_pk, pk):
    division = get_object_or_404(Division, name=division_name.lower())
    program = get_object_or_404(Program, division=division, name="vocational")
    trainer = get_object_or_404(VocationalTrainingProgramTrainerDetail.all_objects.select_related('program__division'), pk=trainer_pk, program=program) # trainer might be soft-deleted
    instance = VocationalTrainingProgramTraineeDetail.all_objects.filter(pk=pk, trainer=trainer, is_deleted=True).first()
    if not instance:
        return Response({'detail': 'Not found in recycle bin or does not belong to this trainer.'}, status=status.HTTP_404_NOT_FOUND)

    instance_pk = instance.pk
    instance.delete(user=request.user)

    RecycleBinItem.objects.filter(
        content_type=ContentType.objects.get_for_model(VocationalTrainingProgramTraineeDetail),
        object_id_uuid=instance_pk
    ).delete()
    return Response({'detail': 'Vocational trainee permanently deleted.'}, status=204)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def vocational_trainee_recycle_bin(request, division_name, trainer_pk):
    division = get_object_or_404(Division, name=division_name.lower())
    program = get_object_or_404(Program, division=division, name="vocational")
    # Trainer itself could be soft-deleted, so use all_objects if listing its soft-deleted trainees
    trainer = get_object_or_404(VocationalTrainingProgramTrainerDetail.all_objects.select_related('program__division'), pk=trainer_pk, program=program)
    
    queryset = VocationalTrainingProgramTraineeDetail.all_objects.filter(trainer=trainer, is_deleted=True).order_by('-deleted_at')
    
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = VocationalTrainingProgramTraineeDetailSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)