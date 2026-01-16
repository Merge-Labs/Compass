**Deploy (Docker) — quick guide**

- **Development (local)**

  1. Copy `.env` from `env.example` and adjust values.
  2. Build and run with:

```bash
cd nisria-backend
docker compose -f docker-compose.dev.yml up --build
```

- **Production (server)**

  1. Copy `.env.prod` from `env.prod.example` and fill real secrets.
  2. Place this repository on the Contabo server and install Docker + Docker Compose.
  3. Build and run the prod stack:

```bash
cd nisria-backend
docker compose -f docker-compose.prod.yml up --build -d
```

4. On first deploy run migrations and collectstatic (the entrypoint does this automatically for production).
5. Configure TLS (Certbot) or a reverse proxy in front of the `nginx` service.

- **Notes / next steps**

- Make `docker-entrypoint.sh` executable if needed: `chmod +x docker-entrypoint.sh`.
- Consider pushing images to a registry and using `image:` in `docker-compose.prod.yml` for immutable releases.
- If you use `DATABASE_URL` style connection strings, adapt `compass/settings.py` accordingly.
