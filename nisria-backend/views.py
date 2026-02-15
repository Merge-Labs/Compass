"""
Health check views for Coolify and other monitoring services.
"""
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import redis
from decouple import config


def health_check(request):
    """
    Basic health check endpoint.
    Returns 200 if the application is running.
    """
    return JsonResponse({
        "status": "healthy",
        "service": "nisria-backend"
    })


def health_check_detailed(request):
    """
    Detailed health check that verifies database and Redis connections.
    Use this for thorough health monitoring.
    """
    health_status = {
        "status": "healthy",
        "service": "nisria-backend",
        "checks": {}
    }
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status["checks"]["database"] = "healthy"
    except Exception as e:
        health_status["checks"]["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check Redis connection
    try:
        redis_url = config('REDIS_URL', default='redis://localhost:6379/0')
        r = redis.from_url(redis_url)
        r.ping()
        health_status["checks"]["redis"] = "healthy"
    except Exception as e:
        health_status["checks"]["redis"] = f"unhealthy: {str(e)}"
        # Redis being down shouldn't fail the health check completely
        # as the app can still function without it for basic operations
        health_status["checks"]["redis_warning"] = "Redis unavailable but app can still function"
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    return JsonResponse(health_status, status=status_code)
