import os
from celery import Celery
from celery.schedules import crontab 
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compass.settings') 

app = Celery('compass')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Add periodic tasks
app.conf.beat_schedule = {
    # Example task that runs every 30 minutes
    'debug-task-every-30-minutes': {
        'task': 'compass.celery.debug_task',
        'schedule': 1800.0,  # 30 minutes in seconds
    },
    # Add more periodic tasks here as needed
}

@app.task(bind=True)
def debug_task(self):
    print('Debug task executed')
    return 'Debug task completed successfully'