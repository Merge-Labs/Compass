import os
from celery import Celery
from celery.schedules import crontab 

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compass.settings') 

app = Celery('compass') 

app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Example task (optional, for testing)
# @app.task(bind=True)
# def debug_task(self):
#     print(f'Request: {self.request!r}')