#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: ./scripts/restore-db.sh backups/database/file.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

POSTGRES_USER="${POSTGRES_USER:-pentrunoi}"
POSTGRES_DB="${POSTGRES_DB:-pentrunoi_service_platform}"

if [ -f ".env" ]; then
  POSTGRES_USER="$(grep -E '^POSTGRES_USER=' .env | cut -d= -f2- || echo "$POSTGRES_USER")"
  POSTGRES_DB="$(grep -E '^POSTGRES_DB=' .env | cut -d= -f2- || echo "$POSTGRES_DB")"
fi

echo "WARNING: This will restore into database: $POSTGRES_DB"
echo "Backup file: $BACKUP_FILE"
echo "Type YES to continue:"
read -r CONFIRM

if [ "$CONFIRM" != "YES" ]; then
  echo "Restore cancelled."
  exit 1
fi

gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"

echo "Restore completed."
