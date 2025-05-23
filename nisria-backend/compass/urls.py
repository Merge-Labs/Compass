
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Compass ",
        default_version='v1',
        description="Management system for grants for nisria.inc",
        terms_of_service="",
        contact=openapi.Contact(email="gitaumanasseh1@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/programs/', include('divisions.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/templates/', include('email_templates.urls')),
    path('api/grants/', include('grants.urls')),
    path('api/tasks/', include('task_manager.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
