#!/bin/bash

# Start Redis if not running
if ! redis-cli ping &> /dev/null; then
    echo "Starting Redis server..."
    redis-server --daemonize yes
    sleep 1  # Give Redis a moment to start
fi

# Start Celery worker and beat in the same command
echo "Starting Celery worker and beat..."
celery -A compass worker --loglevel=info --beat --scheduler django_celery_beat.schedulers:DatabaseScheduler