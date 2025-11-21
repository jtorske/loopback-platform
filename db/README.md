# DB initialization (schema and seeding scripts)

Location: `./db/init/`

## Quick start (PowerShell)
1. Copy `.env.example` to `.env` and set MySQL variables (`MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`).
```powershell
Copy-Item .env.example .env
notepad .env
```
2. Build and start the stack (uses `.env` values):
```powershell
docker compose up -d --build
```
3. Check DB logs to confirm `schema.sql` and `seed.sql` executed:
```powershell
docker compose logs -f db
```

## Re-run init scripts (development only)
- These init scripts run only the first time the MySQL data directory is empty. To re-run them you must remove the DB volume (this deletes all data):
```powershell
docker compose down
docker volume rm db_data
docker compose up -d --build
```

## Run SQL manually
- To apply scripts or run a single file against a running container:
```powershell
# execute into container and run mysql client
docker compose exec db mysql -u root -p
# then inside container: SOURCE /docker-entrypoint-initdb.d/schema.sql;
```
