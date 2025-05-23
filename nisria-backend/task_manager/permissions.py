from rest_framework.permissions import BasePermission

class CanManageAllTasks(BasePermission):
    """
    Allows full management access (create, view all, update all, delete)
    only to Super Admins or Management Leads.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['super_admin', 'management_lead']

class IsAssigneeOrManagerForTaskObject(BasePermission):
    """
    Allows access to a task object if the user is the assignee
    or a Super Admin/Management Lead.
    Used for retrieve, and as a base for update.
    """
    def has_object_permission(self, request, view, obj): # obj is the Task instance
        if not request.user or not request.user.is_authenticated:
            return False
        
        is_manager = request.user.role in ['super_admin', 'management_lead']
        is_assignee = obj.assigned_to == request.user
        
        return is_assignee or is_manager