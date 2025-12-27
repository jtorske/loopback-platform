## LoopBack

Contributors

- Riyad Abdullayev  
- Gaurav Ashar  
- Isaac Hus  
- Luke Nodwell  
- Jordan Torske  


## Project Summary

LoopBack is a centralized feedback platform designed to connect consumers and companies through
structured, visible, and actionable product feedback. Unlike traditional review systems where
feedback is often fragmented or ignored, LoopBack provides a single ecosystem where verified
consumers can share insights and companies can directly engage with user sentiment.

The platform supports multiple user roles, including consumers, corporate employees,
corporate administrators, and system administrators. Core features include product management,
categorized feedback posts, voting, replies, company announcements, and content moderation.
By organizing feedback and surfacing meaningful trends, LoopBack enables companies to make
data-driven product improvements while ensuring users feel their voices are heard.

## Project Overview

- `backend/` — Flask backend (Python)
- `frontend/` — Angular frontend
- `docker-compose.yml` — defines three services:
  - `client` (Angular frontend)
  - `server` (Flask backend)
  - `db` (MySQL database)

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
