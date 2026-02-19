#!/bin/bash
set -e

echo "=== Django Production Entrypoint ==="

# Wait for database to be ready
echo "Waiting for database..."
while ! python -c "
import os
import sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compass.settings')
import django
django.setup()
from django.db import connection
try:
    connection.ensure_connection()
    print('Database is ready!')
    sys.exit(0)
except Exception as e:
    print(f'Database not ready: {e}')
    sys.exit(1)
" 2>/dev/null; do
    echo "Database not ready, waiting 2 seconds..."
    sleep 2
done

# Run migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create cache table if using database cache
# python manage.py createcachetable --verbosity 0 || true

echo "Starting application..."

# Start the appropriate service based on the SERVICE_TYPE environment variable
case "${SERVICE_TYPE:-web}" in
    "web")
        echo "Starting Gunicorn web server..."
        exec gunicorn compass.wsgi:application \
            --bind 0.0.0.0:${PORT:-8000} \
            --workers ${GUNICORN_WORKERS:-3} \
            --threads ${GUNICORN_THREADS:-2} \
            --worker-class gthread \
            --worker-tmp-dir /dev/shm \
            --timeout ${GUNICORN_TIMEOUT:-120} \
            --keep-alive ${GUNICORN_KEEP_ALIVE:-5} \
            --max-requests ${GUNICORN_MAX_REQUESTS:-1000} \
            --max-requests-jitter ${GUNICORN_MAX_REQUESTS_JITTER:-100} \
            --access-logfile - \
            --error-logfile - \
            --capture-output \
            --enable-stdio-inheritance
        ;;
    "celery-worker")
        echo "Starting Celery worker..."
        exec celery -A compass worker \
            --loglevel=${CELERY_LOG_LEVEL:-info} \
            --concurrency=${CELERY_CONCURRENCY:-2}
        ;;
    "celery-beat")
        echo "Starting Celery beat scheduler..."
        exec celery -A compass beat \
            --loglevel=${CELERY_LOG_LEVEL:-info} \
            --scheduler django_celery_beat.schedulers:DatabaseScheduler
        ;;
    *)
        echo "Unknown SERVICE_TYPE: ${SERVICE_TYPE}"
        echo "Valid options: web, celery-worker, celery-beat"
        exit 1
        ;;
esac
