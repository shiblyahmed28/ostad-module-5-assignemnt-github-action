#!/bin/bash

# Database Restore Script for BMI Health Tracker

set -e

# Configuration
DB_USER="bmi_user"
DB_NAME="bmidb"
BACKUP_DIR="$HOME/bmi_backups"

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Get password
read -sp "Enter database password: " DB_PASSWORD
echo

export PGPASSWORD="$DB_PASSWORD"

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -k "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Drop existing connections
echo "Terminating existing connections..."
psql -U "$DB_USER" -h localhost -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME';" 2>/dev/null || true

# Restore
echo "Restoring database..."
psql -U "$DB_USER" -h localhost "$DB_NAME" < "$BACKUP_FILE"

echo "Database restored successfully!"

unset PGPASSWORD
