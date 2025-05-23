from django.urls import path
from .views import (
    list_tasks,
    create_task,
    retrieve_task,
    update_task,
    mark_task_as_complete,
    change_task_status
)

urlpatterns = [
    path('', list_tasks, name='task-list'),
    path('create/', create_task, name='task-create'),
    path('<int:pk>/', retrieve_task, name='task-detail'),
    path('<int:pk>/update/', update_task, name='task-update'),
    # path('<int:pk>/delete/', delete_task, name='task-delete'),
    path('<int:pk>/mark_complete/', mark_task_as_complete, name='task-mark-complete'),
    path('<int:pk>/change_status/', change_task_status, name='task-change-status'),
]