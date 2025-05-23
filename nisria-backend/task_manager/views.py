from django.shortcuts import get_object_or_404
from rest_framework import status, permissions as drf_permissions
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Task
from .serializers import TaskSerializer
from .permissions import CanManageAllTasks, IsAssigneeOrManagerForTaskObject
from accounts.models import User # For role comparison

@api_view(['GET'])
@permission_classes([drf_permissions.IsAuthenticated])
def list_tasks(request):
    user = request.user
    base_queryset = Task.objects.select_related('assigned_to', 'assigned_by') 

    if user.role in ['super_admin', 'management_lead']:
        # By default, super_admin/management_lead see all tasks.
        # Allow filtering by tasks they created via a query parameter.
        filter_created_by_me = request.query_params.get('created_by_me', 'false').lower() == 'true'
        if filter_created_by_me:
            tasks_queryset = base_queryset.filter(assigned_by=user)
        else:
            tasks_queryset = base_queryset.all() # All tasks
    else:
        # Other roles see tasks assigned to them.
        tasks_queryset = base_queryset.filter(assigned_to=user)

    # Search functionality
    search_query = request.query_params.get('search', None)
    if search_query:
        tasks_queryset = tasks_queryset.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)
        )

    # Filtering functionality
    status_filter = request.query_params.get('status', None)
    if status_filter:
        tasks_queryset = tasks_queryset.filter(status=status_filter)

    priority_filter = request.query_params.get('priority', None)
    if priority_filter:
        tasks_queryset = tasks_queryset.filter(priority=priority_filter)

    assigned_to_id_filter = request.query_params.get('assigned_to_id', None)
    if assigned_to_id_filter:
        # Ensure this filter doesn't override the base permission for non-managers
        if user.role in ['super_admin', 'management_lead']:
            tasks_queryset = tasks_queryset.filter(assigned_to__id=assigned_to_id_filter)
        # Non-managers can only see tasks assigned to them, so this filter might be redundant
        # or could be used to confirm if a task they are seeing is assigned to a specific ID (which would be their own).

    due_date_filter = request.query_params.get('due_date', None)
    if due_date_filter:
        tasks_queryset = tasks_queryset.filter(due_date=due_date_filter)

    # Add more filters as needed (e.g., due_date_before, due_date_after)
    
    serializer = TaskSerializer(tasks_queryset, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([drf_permissions.IsAuthenticated, CanManageAllTasks])
def create_task(request):
    serializer = TaskSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(assigned_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([drf_permissions.IsAuthenticated])
def retrieve_task(request, pk):
    task = get_object_or_404(Task.objects.select_related('assigned_to', 'assigned_by'), pk=pk)
    
    # Manually check object permission
    permission_checker = IsAssigneeOrManagerForTaskObject()
    if not permission_checker.has_object_permission(request, None, task): # Pass None for view if not used by perm
        raise PermissionDenied("You do not have permission to view this task.")
        
    serializer = TaskSerializer(task)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([drf_permissions.IsAuthenticated])
def update_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    
    # Manually check object permission
    permission_checker = IsAssigneeOrManagerForTaskObject()
    if not permission_checker.has_object_permission(request, None, task):
        raise PermissionDenied("You do not have permission to modify this task.")

    user = request.user
    # Logic from perform_update in ViewSet
    if not (user.role in ['super_admin', 'management_lead']) and task.assigned_to == user:
        allowed_fields_for_assignee = {'status', 'priority'}
        
        # For PATCH, request.data contains only fields to be updated
        # For PUT, request.data contains all fields
        updated_fields = set(request.data.keys())
        
        # If it's a PUT request, we need to ensure only allowed fields are present if others are unchanged
        # This is simpler if we just check if any forbidden fields are being *changed*
        forbidden_fields_being_changed = updated_fields - allowed_fields_for_assignee
        
        if forbidden_fields_being_changed:
            raise PermissionDenied(
                f"As an assignee, you can only update: {', '.join(allowed_fields_for_assignee)}. "
                f"You attempted to update: {', '.join(forbidden_fields_being_changed)}."
            )

    partial_update = request.method == 'PATCH'
    serializer = TaskSerializer(task, data=request.data, partial=partial_update, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# @permission_classes([drf_permissions.IsAuthenticated, CanManageAllTasks])
# def delete_task(request, pk):
#     task = get_object_or_404(Task, pk=pk)
#     # CanManageAllTasks already ensures only super_admin/management_lead can access this view.
#     # No further object-level check is strictly needed here if only those roles can delete.
#     task.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([drf_permissions.IsAuthenticated])
def mark_task_as_complete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    # Removed IsAssigneeOrManagerForTaskObject check to allow any authenticated user
    # to mark any task as complete.
        
    if task.status == 'completed':
        return Response({'detail': 'Task is already completed.'}, status=status.HTTP_400_BAD_REQUEST)
    
    task.status = 'completed'
    task.save(update_fields=['status', 'updated_at'])
    serializer = TaskSerializer(task)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([drf_permissions.IsAuthenticated])
def change_task_status(request, pk):
    task = get_object_or_404(Task, pk=pk)
    # Removed IsAssigneeOrManagerForTaskObject check to allow any authenticated user
    # to change the status of any task.
    new_status = request.data.get('status')

    if not new_status:
        return Response({'status': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
    
    valid_statuses = [s[0] for s in Task.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response({'status': [f'Invalid status. Valid statuses are: {", ".join(valid_statuses)}']}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    task.status = new_status
    task.save(update_fields=['status', 'updated_at'])
    serializer = TaskSerializer(task)
    return Response(serializer.data)
