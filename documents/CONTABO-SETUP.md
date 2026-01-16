**Contabo server setup (Docker + Docker Compose + TLS) — quick checklist**

Prerequisites: you have a domain name pointing to your Contabo server public IP.

- Update and install packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
```

- Install Docker (official convenience install)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

- Install Docker Compose plugin

```bash
DOCKER_COMPOSE_VERSION="v2.24.2"
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

- Configure firewall (ufw)

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

- Clone repo and create env file

```bash
git clone <your-repo-url> app
cd app/nisria-backend
cp env.prod.example .env.prod
# Edit .env.prod and set SECRET_KEY, DATABASE credentials, ALLOWED_HOSTS, etc.
```

- Build and start the production stack (detached)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- Check logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

- Obtain TLS certificates with Certbot (using nginx)

```bash
sudo apt install -y certbot python3-certbot-nginx
# Ensure nginx is running and reachable on port 80 for the domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- Automate renewals (installed by certbot package). Test renewal:

```bash
sudo certbot renew --dry-run
```

- Optional: use a private registry / CI for image updates

Notes:

- Replace placeholders (domain, DB credentials) before running.
- If using managed Postgres you may prefer `DATABASE_URL` in `.env.prod` instead of local Postgres container.
- For zero-downtime deploys consider using `docker compose pull` + `docker compose up -d` with images pushed to a registry.
