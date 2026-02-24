#!/bin/bash
# Startup script for Render Native Environment

echo "Installing dependencies..."
npm ci

# Clean up any old Puppeteer cache outside the project, just in case
rm -rf ~/.cache/puppeteer 2>/dev/null

if [ "$RENDER" = "true" ]; then
    echo "Detected Render environment. Installing Chrome..."
    # With .puppeteerrc.cjs present, this automatically installs into puppeteer-cache-dir
    npx puppeteer browsers install chrome
else
    echo "Local or Docker environment detected. Skipping explicit Chrome install."
fi

# Start the application
echo "Starting application..."
npm start
