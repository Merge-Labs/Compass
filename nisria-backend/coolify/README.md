# Coolify Quick Setup Guide

## Overview

This project is configured for deployment to Coolify with:

- **Beta Environment**: For testing and staging
- **Production Environment**: For live deployment

## Files Created

```
├── docker-compose.beta.yml        # Docker Compose for beta deployment
├── docker-compose.production.yml  # Docker Compose for production deployment
├── .env.beta.example              # Example environment variables for beta
├── .env.production.example        # Example environment variables for production
├── views.py                       # Health check endpoints
└── coolify/
    ├── DEPLOYMENT.md              # Detailed deployment guide
    └── nixpacks.toml              # Nixpacks configuration (optional)
```

## Quick Start

### Option 1: Dockerfile Deployment (Recommended)

1. In Coolify, create a new application
2. Select **Dockerfile** as build method
3. Point to your repository
4. Set environment variables (copy from `.env.beta.example` or `.env.production.example`)
5. Configure the domain
6. Deploy!

### Option 2: Docker Compose Deployment

1. In Coolify, create a new application
2. Select **Docker Compose** as deployment method
3. Point to `docker-compose.beta.yml` or `docker-compose.production.yml`
4. Set environment variables in Coolify
5. Deploy!

## Required Environment Variables

```bash
# Core
SECRET_KEY=<unique-secret-key>
DJANGO_ENV=production
DEBUG=False

# Database
DATABASE_URL=postgres://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379/0

# Domains
ALLOWED_HOSTS=api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

## Health Check Endpoints

- Basic: `GET /api/health/`
- Detailed: `GET /api/health/detailed/`

## Celery Workers

For background tasks, deploy additional containers with these commands:

**Worker:**

```bash
celery -A compass worker --loglevel=info
```

**Beat (Scheduler):**

```bash
celery -A compass beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## See Also

- [Detailed Deployment Guide](coolify/DEPLOYMENT.md)
