# Loopback

Group 6

## Project overview

- `backend/` — Flask backend (Python)
- `frontend/` — Angular frontend
- `docker-compose.yml` — defines three services: `client` (frontend), `server` (backend), and `db` (MySQL)

## Environment

This repository uses an environment file (`.env`) for sensitive configuration (DB credentials, application secrets). A safe example is provided in `.env.example`.

- Copy `.env.example` to `.env` in the root directory and fill in real values before starting the services.

## Ports

- Frontend (client): host 4200 -> container 4200
- Backend (server): host 5000 -> container 5000
- MySQL (db): host 3307 -> container 3306 (connect from host to localhost:3307)

## Run locally (development)

Build images and start services (PowerShell):
```powershell
# build and run using your local .env
docker compose up -d --build
```

If you prefer the separate build step:
```powershell
docker compose build --no-cache
docker compose up -d
```

## Stop / clean

Stop containers (keep images/volumes):
```powershell
docker compose down
```

Stop and remove images, volumes, and orphan containers:
```powershell
docker compose down --rmi all --volumes --remove-orphans
```
