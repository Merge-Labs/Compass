from  django.http import JsonResponse

def indexTest(request):
    return JsonResponse({"message": "API endpoints working in notifications app"})

