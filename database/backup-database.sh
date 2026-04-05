#!/bin/bash

# Database Backup Script for BMI Health Tracker

set -e

# Configuration
DB_USER="bmi_user"
DB_NAME="bmidb"
BACKUP_DIR="$HOME/bmi_backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get password
read -sp "Enter database password: " DB_PASSWORD
echo

export PGPASSWORD="$DB_PASSWORD"

# Create backup
echo "Creating backup..."
pg_dump -U "$DB_USER" -h localhost "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

echo "Backup created: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
cd "$BACKUP_DIR"
ls -t ${DB_NAME}_*.sql.gz | tail -n +8 | xargs -r rm

echo "Backup complete!"

unset PGPASSWORD
