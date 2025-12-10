#!/usr/bin/env bash
# exit on error
set -o errexit

# Navigate to Django project directory
cd nisria-backend

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running database migrations..."
python manage.py migrate --no-input

echo "Build completed successfully!"