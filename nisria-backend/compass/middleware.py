"""
Custom middleware for production deployment.
"""


class HealthCheckMiddleware:
    """
    Middleware that allows health check endpoints to bypass SSL redirect.
    This is necessary because Docker/Coolify healthchecks use HTTP internally.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Allow health check paths to bypass SSL redirect
        # by setting the X-Forwarded-Proto header to https
        if request.path in ['/health/', '/api/health/', '/api/health/detailed/']:
            request.META['HTTP_X_FORWARDED_PROTO'] = 'https'
        
        return self.get_response(request)
