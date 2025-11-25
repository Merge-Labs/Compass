#!/bin/bash
# Start Redis if not running
if ! redis-cli ping &> /dev/null; then
    echo "Starting Redis server..."
    redis-server --daemonize yes
    sleep 1
fi
# Start Celery worker and beat in one command
celery -A compass worker --loglevel=info --beat --scheduler django_celery_beat.schedulers:DatabaseScheduler
