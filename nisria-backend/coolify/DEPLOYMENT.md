# Coolify Deployment Guide

This guide explains how to deploy the Nisria Backend to Coolify for both **Beta (Testing)** and **Production** environments.

## Prerequisites

1. A Coolify instance (self-hosted or cloud)
2. A GitHub repository with your code
3. PostgreSQL database (can be deployed via Coolify or external)
4. Redis instance (can be deployed via Coolify or external)

---

## Environment Setup Overview

| Environment | Purpose          | Domain Example            |
| ----------- | ---------------- | ------------------------- |
| Beta        | Testing/Staging  | `api-beta.yourdomain.com` |
| Production  | Live application | `api.yourdomain.com`      |

---

## Step 1: Prepare Your Repository

Ensure your repository has these files:

- `Dockerfile` (already exists)
- `docker-entrypoint.sh` (already exists)
- `requirements.txt` (already exists)

---

## Step 2: Create Resources in Coolify

### 2.1 Create PostgreSQL Database

1. Go to **Resources** → **New** → **Database** → **PostgreSQL**
2. Create two databases:
   - `nisria-db-beta` for beta environment
   - `nisria-db-prod` for production environment
3. Note down the connection details for each

### 2.2 Create Redis Instance

1. Go to **Resources** → **New** → **Database** → **Redis**
2. Create two Redis instances:
   - `nisria-redis-beta` for beta
   - `nisria-redis-prod` for production
3. Note down the connection URLs

---

## Step 3: Deploy Beta Environment

### 3.1 Create New Application

1. Go to **Resources** → **New** → **Application**
2. Select **Dockerfile** as the build method
3. Connect your GitHub repository
4. Set the branch to `develop` or `staging`

### 3.2 Configure Build Settings

- **Dockerfile Location**: `Dockerfile` (root)
- **Build Context**: `.` (root)
- **Port**: `8000`

### 3.3 Set Environment Variables for Beta

```env
# Django Settings
DJANGO_ENV=production
DEBUG=False
SECRET_KEY=<generate-a-secure-key>

# Database (use Coolify's internal DNS or connection string)
DATABASE_URL=postgres://user:password@nisria-db-beta:5432/nisria

# Or use individual variables:
# DATABASE_HOST=nisria-db-beta
# DATABASE_PORT=5432
# DATABASE_NAME=nisria
# DATABASE_USER=<your-user>
# DATABASE_PASSWORD=<your-password>

# Redis
REDIS_URL=redis://nisria-redis-beta:6379/0

# Hosts & CORS
ALLOWED_HOSTS=api-beta.yourdomain.com,localhost
CORS_ALLOWED_ORIGINS=https://beta.yourdomain.com,http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Gunicorn
GUNICORN_WORKERS=2
SKIP_COLLECTSTATIC=0
```

### 3.4 Configure Domain

1. Go to **Domains** tab
2. Add domain: `api-beta.yourdomain.com`
3. Enable **HTTPS** (Let's Encrypt)

### 3.5 Health Check (Optional but Recommended)

- **Path**: `/api/health/`
- **Port**: `8000`
- **Interval**: `30s`

---

## Step 4: Deploy Production Environment

### 4.1 Create New Application

1. Go to **Resources** → **New** → **Application**
2. Select **Dockerfile** as the build method
3. Connect your GitHub repository
4. Set the branch to `main` or `master`

### 4.2 Configure Build Settings

Same as beta:

- **Dockerfile Location**: `Dockerfile`
- **Build Context**: `.`
- **Port**: `8000`

### 4.3 Set Environment Variables for Production

```env
# Django Settings
DJANGO_ENV=production
DEBUG=False
SECRET_KEY=<generate-a-different-secure-key>

# Database
DATABASE_URL=postgres://user:password@nisria-db-prod:5432/nisria

# Redis
REDIS_URL=redis://nisria-redis-prod:6379/0

# Hosts & CORS (production domains)
ALLOWED_HOSTS=api.yourdomain.com,www.api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Gunicorn (more workers for production)
GUNICORN_WORKERS=4
SKIP_COLLECTSTATIC=0
```

### 4.4 Configure Domain

1. Go to **Domains** tab
2. Add domain: `api.yourdomain.com`
3. Enable **HTTPS** (Let's Encrypt)

---

## Step 5: Deploy Celery Workers (Background Tasks)

For each environment, you need Celery workers for background tasks.

### 5.1 Create Celery Worker Application

1. Go to **Resources** → **New** → **Application**
2. Use the same repository and branch as the main app
3. Name it: `nisria-celery-beta` or `nisria-celery-prod`

### 5.2 Override the Start Command

In Coolify, set the **Custom Start Command**:

```bash
celery -A compass worker --loglevel=info
```

### 5.3 Environment Variables

Use the **same environment variables** as the main application.

### 5.4 Create Celery Beat (Scheduler)

1. Create another application: `nisria-celery-beat-beta` or `nisria-celery-beat-prod`
2. Set the **Custom Start Command**:

```bash
celery -A compass beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

---

## Step 6: Alternative - Docker Compose Deployment

If you prefer deploying all services together, use the Docker Compose files:

### For Beta:

```bash
# In Coolify, select "Docker Compose" deployment
# Point to: docker-compose.beta.yml
```

### For Production:

```bash
# Point to: docker-compose.production.yml
```

---

## Environment Variables Reference

| Variable                | Required | Description                | Example                |
| ----------------------- | -------- | -------------------------- | ---------------------- |
| `DJANGO_ENV`            | Yes      | Environment type           | `production`           |
| `DEBUG`                 | Yes      | Debug mode                 | `False`                |
| `SECRET_KEY`            | Yes      | Django secret key          | `your-secret-key`      |
| `DATABASE_URL`          | Yes\*    | Full database URL          | `postgres://...`       |
| `DATABASE_HOST`         | Yes\*    | Database host              | `db`                   |
| `DATABASE_PORT`         | No       | Database port              | `5432`                 |
| `DATABASE_NAME`         | Yes\*    | Database name              | `nisria`               |
| `DATABASE_USER`         | Yes\*    | Database user              | `nisria`               |
| `DATABASE_PASSWORD`     | Yes\*    | Database password          | `secret`               |
| `REDIS_URL`             | Yes      | Redis connection URL       | `redis://redis:6379/0` |
| `ALLOWED_HOSTS`         | Yes      | Comma-separated hosts      | `api.domain.com`       |
| `CORS_ALLOWED_ORIGINS`  | Yes      | Comma-separated origins    | `https://domain.com`   |
| `CLOUDINARY_CLOUD_NAME` | Yes      | Cloudinary cloud name      | `your-cloud`           |
| `CLOUDINARY_API_KEY`    | Yes      | Cloudinary API key         | `123456`               |
| `CLOUDINARY_API_SECRET` | Yes      | Cloudinary API secret      | `secret`               |
| `GUNICORN_WORKERS`      | No       | Number of Gunicorn workers | `4`                    |
| `SKIP_COLLECTSTATIC`    | No       | Skip static collection     | `0`                    |

\*Either `DATABASE_URL` OR the individual database variables are required.

---

## Deployment Checklist

### Before First Deployment:

- [ ] Generate unique `SECRET_KEY` for each environment
- [ ] Set up PostgreSQL database in Coolify
- [ ] Set up Redis in Coolify
- [ ] Configure Cloudinary credentials
- [ ] Set up DNS records for your domains

### After Deployment:

- [ ] Verify health check endpoint works
- [ ] Check database migrations ran successfully
- [ ] Test API endpoints
- [ ] Verify Celery workers are processing tasks
- [ ] Check logs for any errors

---

## Troubleshooting

### Database Connection Issues

- Ensure the database service is running
- Check if the internal DNS name is correct (e.g., `nisria-db-beta`)
- Verify credentials in environment variables

### Static Files Not Loading

- Ensure `SKIP_COLLECTSTATIC=0`
- Check if WhiteNoise is properly configured

### CORS Errors

- Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain
- Ensure the protocol (http/https) matches

### Celery Tasks Not Running

- Check if Redis is accessible
- Verify `REDIS_URL` is correct
- Check Celery worker logs

---

## Useful Commands

### Generate a Secret Key

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Check Logs in Coolify

1. Go to your application
2. Click on **Logs** tab
3. View real-time logs

### Manual Database Migration

If migrations don't run automatically, you can run them via Coolify's terminal:

```bash
python manage.py migrate
```

---

## Security Recommendations

1. **Never commit secrets** to your repository
2. **Use different SECRET_KEY** for each environment
3. **Enable HTTPS** for all domains
4. **Restrict database access** to internal network only
5. **Regularly rotate credentials**
6. **Monitor logs** for suspicious activity
