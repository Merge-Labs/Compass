from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

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

# --- Program Definition Views ---
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
def education_program_search(request, division_name):
    return _base_program_detail_list_logic(request, division_name, "education", search_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def education_program_filter(request, division_name):
    return _base_program_detail_list_logic(request, division_name, "education", filter_logic=True)

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
    return _base_program_detail_list_logic(request, division_name, "microfund", filter_logic=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def microfund_program_search(request, division_name): 
    return _base_program_detail_list_logic(request, division_name, "microfund", search_logic=True)

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
    return _base_program_detail_list_logic(request, division_name, "rescue", filter_logic=True)

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
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vocational_trainer_list_create(request, division_name):
    # Uses "vocational-trainer" key from PROGRAM_DETAIL_METADATA
    # This view uses the generic _program_list_create_view because TrainerDetail links directly to Program
    return _program_list_create_view(request, division_name, "vocational-trainer")

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def vocational_trainer_detail(request, division_name, pk):
    # Uses "vocational-trainer" key
    # This view uses the generic _program_detail_view because TrainerDetail links directly to Program
    return _program_detail_view(request, division_name, "vocational-trainer", pk)

# --- Vocational Program Trainee Views (Nested under Trainer) ---
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

@api_view(['GET']) # Filters VocationalTrainingProgramTraineeDetail
@permission_classes([IsAuthenticated])
def vocational_program_filter(request, division_name):
    return _base_trainee_list_logic(request, division_name, "vocational", filter_logic=True)

@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def vocational_program_search(request, division_name):
    return _base_trainee_list_logic(request, division_name, "vocational", search_logic=True)