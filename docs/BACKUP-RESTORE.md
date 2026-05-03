# Backup and Restore

This project must be easy to back up and move to a new Docker environment.

## What must be backed up

- PostgreSQL database
- uploads folder
- private .env file
- Prisma migrations
- source code
- generated PDFs and documents when added later
- legal/settings content when added later

## Database backup

Run:

./scripts/backup-db.sh

Database backups are saved in:

backups/database/

## Database restore

Run:

./scripts/restore-db.sh backups/database/YOUR-BACKUP.sql.gz

You must type YES to confirm the restore.

## Uploads export

Run:

./scripts/export-uploads.sh

Uploads exports are saved in:

backups/uploads/

## Uploads import

Run:

./scripts/import-uploads.sh backups/uploads/YOUR-UPLOADS.tar.gz

You must type YES to confirm the import.

## Moving to a new Docker server

1. Stop the app.
2. Create database backup.
3. Export uploads.
4. Copy repository to the new server.
5. Copy private .env manually.
6. Start Docker services.
7. Restore database.
8. Import uploads.
9. Run Prisma migrations if needed.
10. Test homepage, status page, admin page and health check.

## Important

Do not commit real backups to GitHub.

Only scripts and documentation should be committed.
