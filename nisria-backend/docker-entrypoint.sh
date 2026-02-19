#!/bin/sh
set -e

# Wait for Postgres if DATABASE_HOST provided
if [ -n "$DATABASE_HOST" ]; then
  echo "Waiting for Postgres at $DATABASE_HOST:$DATABASE_PORT..."
  until nc -z "$DATABASE_HOST" "${DATABASE_PORT:-5432}"; do
    sleep 1
  done
fi

echo "Apply database migrations"
python manage.py migrate --noinput

if [ "${DJANGO_ENV:-development}" = "production" ]; then
  if [ "${SKIP_COLLECTSTATIC:-0}" = "1" ]; then
    echo "SKIP_COLLECTSTATIC=1 set; skipping collectstatic"
  else
    echo "Collect static files"
    python manage.py collectstatic --noinput
  fi
  echo "Starting Gunicorn"
  exec gunicorn compass.wsgi:application --bind 0.0.0.0:8001 --workers ${GUNICORN_WORKERS:-4}
else
  echo "Starting Django development server"
  exec python manage.py runserver 0.0.0.0:8001
fi
