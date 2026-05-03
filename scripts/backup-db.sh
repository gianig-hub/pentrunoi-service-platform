#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

BACKUP_DIR="$PROJECT_ROOT/backups/database"
mkdir -p "$BACKUP_DIR"

TS="$(date +%F-%H%M%S)"
OUT="$BACKUP_DIR/pentrunoi-db-$TS.sql.gz"

POSTGRES_USER="${POSTGRES_USER:-pentrunoi}"
POSTGRES_DB="${POSTGRES_DB:-pentrunoi_service_platform}"

if [ -f ".env" ]; then
  POSTGRES_USER="$(grep -E '^POSTGRES_USER=' .env | cut -d= -f2- || echo "$POSTGRES_USER")"
  POSTGRES_DB="$(grep -E '^POSTGRES_DB=' .env | cut -d= -f2- || echo "$POSTGRES_DB")"
fi

echo "Creating database backup..."
echo "Database: $POSTGRES_DB"
echo "Output: $OUT"

docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$OUT"

echo "Done: $OUT"
