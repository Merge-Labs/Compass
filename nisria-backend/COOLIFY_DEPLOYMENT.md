# Coolify Deployment Guide for Nisria Backend

This guide explains how to deploy the Nisria Django backend application on Coolify using Docker + Git.

## Prerequisites

1. A Coolify instance set up and running
2. A PostgreSQL database (can be created in Coolify)
3. A Redis instance (can be created in Coolify)
4. Cloudinary account for media storage

## Environment Variables

You need to configure the following environment variables in Coolify:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key (generate a secure one) | `your-super-secret-key-here` |
| `DEBUG` | Set to 0 for production | `0` |
| `DJANGO_ENV` | Environment type | `production` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgres://user:pass@host:5432/dbname` |
| `REDIS_URL` | Redis connection URL | `redis://host:6379/0` |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hosts | `your-domain.com,www.your-domain.com` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `https://your-frontend.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the web server | `8000` |
| `GUNICORN_WORKERS` | Number of Gunicorn workers | `3` |
| `GUNICORN_THREADS` | Threads per worker | `2` |
| `GUNICORN_TIMEOUT` | Request timeout in seconds | `120` |
| `CELERY_CONCURRENCY` | Celery worker concurrency | `2` |
| `CELERY_LOG_LEVEL` | Celery logging level | `info` |
| `SERVICE_TYPE` | Service to run (web/celery-worker/celery-beat) | `web` |

## Deployment Steps

### Step 1: Create Database and Redis Services

1. In Coolify, go to **Resources** → **New Resource**
2. Create a **PostgreSQL** database
   - Note the connection URL provided
3. Create a **Redis** instance
   - Note the connection URL provided

### Step 2: Deploy the Web Application

1. Go to **Resources** → **New Resource** → **Application**
2. Select **Docker** as the build pack
3. Connect your Git repository
4. Configure the following:
   - **Build Pack**: Dockerfile
   - **Dockerfile Location**: `Dockerfile` (root of repo)
   - **Port**: `8000`
   
5. Add environment variables (see table above)
6. Make sure `SERVICE_TYPE=web` (or omit it, web is default)
7. Deploy!

### Step 3: Deploy Celery Worker (Optional but Recommended)

If you need background task processing:

1. Create another application from the same repository
2. Use the same Dockerfile
3. Set the same environment variables PLUS:
   - `SERVICE_TYPE=celery-worker`
4. **Important**: Set port to `0` or disable public access (workers don't need a port)

### Step 4: Deploy Celery Beat Scheduler (Optional)

If you need scheduled/periodic tasks:

1. Create another application from the same repository
2. Use the same Dockerfile
3. Set the same environment variables PLUS:
   - `SERVICE_TYPE=celery-beat`
4. **Important**: Set port to `0` or disable public access

## Health Checks

The application exposes health check endpoints:

- `GET /health/` - Basic health check (used by Docker)
- `GET /api/health/` - Same as above
- `GET /api/health/detailed/` - Detailed health check (includes DB and Redis status)

Coolify will use the Docker HEALTHCHECK defined in the Dockerfile.

## Generating a Secret Key

Generate a secure Django secret key using Python:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Or use:

```bash
openssl rand -base64 50
```

## Troubleshooting

### Database Connection Issues

- Ensure the DATABASE_URL is correct
- Make sure the database is accessible from the application container
- Check if the database name, user, and password are correct

### Static Files Not Loading

- The entrypoint script automatically runs `collectstatic`
- WhiteNoise serves static files in production
- Check the logs for any collectstatic errors

### Celery Tasks Not Running

- Ensure Redis is running and accessible
- Check that `REDIS_URL` is correctly configured
- View Celery worker logs for any errors

### CORS Issues

- Make sure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Include the protocol (https://)

## Logs

View application logs in Coolify:

1. Go to your application
2. Click on **Logs** tab
3. Select the container to view its logs

## Scaling

To scale the application:

1. **Web workers**: Increase `GUNICORN_WORKERS` environment variable
2. **Celery workers**: Deploy multiple Celery worker instances or increase `CELERY_CONCURRENCY`
3. **Horizontal scaling**: Deploy multiple instances of the web application behind a load balancer

## SSL/HTTPS

Coolify handles SSL termination automatically when you configure a domain. The application is configured to:

- Redirect HTTP to HTTPS in production
- Trust the `X-Forwarded-Proto` header from the reverse proxy
- Set secure cookie flags

## Database Migrations

Migrations run automatically on each deployment via the entrypoint script. If you need to run migrations manually:

```bash
# In the container
python manage.py migrate
```

## Creating a Superuser

After deployment, create an admin user:

```bash
# Access the container shell in Coolify and run:
python manage.py createsuperuser
```
