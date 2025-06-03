# /home/manasseh/Documents/Zindua-Software-Dev/final-capstone/nisria-backend/core/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType

from .models import RecycleBinItem
from .serializers import RecycleBinItemSerializer # You'll need to create this
from accounts.permissions import IsSuperAdmin # Assuming you have this permission class

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsSuperAdmin])
def recycle_bin_list_view(request):
    """
    Lists all items currently in the recycle bin (not permanently deleted or restored).
    """
    items = RecycleBinItem.objects.filter(restored_at__isnull=True, expires_at__gt=timezone.now())
    serializer = RecycleBinItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSuperAdmin])
def recycle_bin_restore_view(request, pk):
    """
    Restores an item from the recycle bin.
    """
    item = get_object_or_404(RecycleBinItem, pk=pk, restored_at__isnull=True, expires_at__gt=timezone.now())
    
    original_object = item.get_original_object()
    if not original_object:
        return Response(
            {"error": "Original object not found or already hard-deleted. Cannot restore."},
            status=status.HTTP_404_NOT_FOUND
        )

    if hasattr(original_object, 'restore'):
        original_object.restore() # This sets is_deleted=False on the original model
        item.restored_at = timezone.now()
        item.restored_by = request.user
        item.save(update_fields=['restored_at', 'restored_by'])
        return Response({"message": f"Item (ID: {item.actual_object_id}) of type '{item.content_type.model}' restored successfully."})
    
    return Response({"error": "Restore functionality not implemented for this model type."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsSuperAdmin])
def recycle_bin_permanently_delete_view(request, pk):
    """
    Permanently deletes an item from the recycle bin AND the original database table.
    """
    item = get_object_or_404(RecycleBinItem, pk=pk, restored_at__isnull=True) # Allow deleting expired items too
    
    original_object = item.get_original_object()
    if original_object:
        # Perform a hard delete on the original object
        original_object.delete(user=request.user) # Pass user to ensure superadmin hard delete logic is hit

    # Even if original object was already gone, we mark the bin item as permanently deleted
    # Or, you might choose to delete the RecycleBinItem itself.
    # For now, let's just delete the RecycleBinItem.
    item.delete() 
    return Response(status=status.HTTP_204_NO_CONTENT)

