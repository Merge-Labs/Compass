# Contabo Server Setup Guide

This guide provides instructions for deploying Compass on a Contabo server using Docker.

## Prerequisites

- Contabo VPS with Ubuntu/Debian
- Docker and Docker Compose installed
- Domain configured with DNS pointing to your server
- SSH access to the server

## Initial Server Setup

1. Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

3. Install Docker Compose:
```bash
sudo apt install docker-compose -y
```

## Deploy Compass

1. Clone the repository:
```bash
git clone https://github.com/Merge-Labs/Compass.git
cd Compass/nisria-backend
```

2. Configure environment variables:
```bash
cp env.prod.example .env.prod
nano .env.prod  # Edit with your production settings
```

Key variables to configure in `.env.prod`:
- `SECRET_KEY`: Generate a secure Django secret key
- `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`: Your PostgreSQL credentials
- `ALLOWED_HOSTS`: Your domain names (e.g., example.com,api.example.com)
- `DEBUG`: Should be `False` in production
- `GUNICORN_WORKERS`: Number of Gunicorn workers (typically 2-4)

3. Build and run the containers:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## Creating the First Super Admin

After deploying for the first time, you need to create a super admin user:

```bash
docker-compose -f docker-compose.prod.yml exec web python manage.py createsuperuser
```

You will be prompted to enter:
- Email address
- Username
- Password
- Password confirmation

This account will have full administrative access to the Compass system.

## Running Migrations

If needed, run database migrations:
```bash
docker-compose -f docker-compose.prod.yml exec web python manage.py migrate
```

## Collecting Static Files

To collect static files for Django admin:
```bash
docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput
```

## SSL/TLS Configuration

Set up SSL certificates using Certbot (replace with your actual domain):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d api.example.com
```

Replace `example.com` with your actual domain name.

## Monitoring Logs

View application logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f web
```

View nginx logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## Updating the Application

To update to the latest version:

```bash
cd Compass
git pull origin main
cd nisria-backend
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build -d
```

## Backup Database

Create a database backup (using the actual database configuration from docker-compose.prod.yml):

```bash
# Using the default configuration from docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U manassehgitau main > backup_$(date +%Y%m%d).sql
```

Note: The database user (`manassehgitau`) and database name (`main`) should match your configuration in `docker-compose.prod.yml`. The `-T` flag disables pseudo-TTY allocation for proper output redirection.

## Troubleshooting

### Container not starting
```bash
docker-compose -f docker-compose.prod.yml logs web
```

### Database connection issues
Check if the database container is running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Permission issues
Ensure proper permissions on the docker-entrypoint.sh:
```bash
chmod +x docker-entrypoint.sh
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [README-deploy.md](./README-deploy.md) - Quick deployment guide
