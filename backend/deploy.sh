#!/bin/bash

# Stop if any error occurs
set -e

echo "🔄 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build the project if needed
# For now, your backend is plain Node.js, so skip

# Stop existing process (if running)
pm2 stop bmi-health-backend || true
pm2 delete bmi-health-backend || true

# Start app with pm2
pm2 start src/server.js --name bmi-health-backend

# Save pm2 process list
pm2 save

echo "✅ Deployment completed!"
