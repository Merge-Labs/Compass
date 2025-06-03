from django.urls import path
from .views import (
    list_tasks,
    create_task,
    retrieve_task,
    update_task,
    delete_task,
    mark_task_as_complete,
    change_task_status
)

urlpatterns = [
    path('', list_tasks, name='task-list'),
    path('create/', create_task, name='task-create'),
    path('<uuid:pk>/', retrieve_task, name='task-detail'),
    path('<uuid:pk>/update/', update_task, name='task-update'),
    path('<uuid:pk>/delete/', delete_task, name='task-delete'),
    path('<uuid:pk>/mark_complete/', mark_task_as_complete, name='task-mark-complete'),
    path('<uuid:pk>/change_status/', change_task_status, name='task-change-status'),
]