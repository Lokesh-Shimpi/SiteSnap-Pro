#!/bin/bash
# Startup script for Render Native Environment
# This script installs Chrome manually if not in Docker, then starts the app.

echo "Installing dependencies..."
npm ci

if [ "$RENDER" = "true" ]; then
    echo "Detected Render environment. Installing Chrome..."
    # Install Chrome for Puppeteer
    npx puppeteer browsers install chrome
else
    echo "Local or Docker environment detected. Skipping explicit Chrome install."
fi

# Start the application
echo "Starting application..."
npm start
