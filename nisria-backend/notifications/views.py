from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

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

    def get_queryset(self):
        user = self.request.user
        read_status_query = self.request.query_params.get('read_status')
        queryset = Notification.objects.filter(recipient=user)
        if read_status_query is not None:
            is_read = read_status_query.lower() == 'true'
            queryset = queryset.filter(read_status=is_read)
        return queryset.order_by('-created_at')

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_as_read(request):
    updated_count = Notification.objects.filter(recipient=request.user, read_status=False).update(read_status=True)
    return Response({"message": f"{updated_count} notifications marked as read."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notifications_count(request):
    count = Notification.objects.filter(recipient=request.user, read_status=False).count()
    return Response({"unread_count": count}, status=status.HTTP_200_OK)
