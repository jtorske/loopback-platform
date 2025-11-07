### Folder structure

- backend contains flask app
- frontend contains angular app
- mysql is spun up using the default mysql image

### To run

run `docker-compose build --no-cache`
run `docker-compose up -d`

### to fully clean

run `docker-compose down --rmi all --volumes --remove-orphans`

### to stop without cleaning

run `docker-compose down`