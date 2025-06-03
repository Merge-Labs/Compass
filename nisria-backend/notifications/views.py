from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from drf_yasg import openapi

from .models import Notification
from .serializers import NotificationSerializer

class NotificationPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NotificationPagination

    @swagger_auto_schema(
        operation_description="List notifications for the authenticated user. Optional query param: read_status=true/false.",
        responses={200: NotificationSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        read_status_query = self.request.query_params.get('read_status')
        queryset = Notification.objects.filter(recipient=user)
        if read_status_query is not None:
            is_read = read_status_query.lower() == 'true'
            queryset = queryset.filter(read_status=is_read)
        return queryset.order_by('-created_at')
    
@swagger_auto_schema(
    method='post',
    operation_description="Mark a specific notification as read.",
    responses={200: NotificationSerializer()}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, recipient=request.user)
        if not notification.read_status:
            notification.read_status = True
            notification.save(update_fields=['read_status'])
        return Response(NotificationSerializer(notification).data)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='post',
    operation_description="Mark all notifications as read for the authenticated user.",
    responses={200: openapi.Response(
        description="Count of notifications marked as read.",
        examples={
            "application/json": {"message": "5 notifications marked as read."}
        }
    )}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_as_read(request):
    updated_count = Notification.objects.filter(recipient=request.user, read_status=False).update(read_status=True)
    return Response({"message": f"{updated_count} notifications marked as read."}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description="Get the count of unread notifications for the authenticated user.",
    responses={200: openapi.Response(
        description="Unread notifications count.",
        examples={
            "application/json": {"unread_count": 3}
        }
    )}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notifications_count(request):
    count = Notification.objects.filter(recipient=request.user, read_status=False).count()
    return Response({"unread_count": count}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='delete',
    operation_description="Delete a specific notification. Users can only delete their own notifications.",
    responses={
        204: 'Notification deleted successfully',
        401: 'Unauthorized',
        403: 'Permission Denied (should not happen if logic is correct, as 404 will be raised)',
        404: 'Notification Not Found or access denied'
    }
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    # get_object_or_404 will ensure the notification exists AND belongs to the request.user
    notification = get_object_or_404(Notification, id=notification_id, recipient=request.user)
    notification.delete() # Hard delete as Notification model doesn't use SoftDeleteModel
    return Response({"message": "Notification deleted successfully."}, status=status.HTTP_204_NO_CONTENT)