#!/bin/bash
# Startup script for Render Native Environment

# Export cache directory globally BEFORE npm ci runs so the postinstall script respects it
export PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer

echo "Installing dependencies..."
npm ci

if [ "$RENDER" = "true" ]; then
    echo "Detected Render environment. Installing Chrome explicitely just in case..."
    npx puppeteer browsers install chrome
else
    echo "Local or Docker environment detected. Skipping explicit Chrome install."
fi

echo "Starting application..."
npm start
