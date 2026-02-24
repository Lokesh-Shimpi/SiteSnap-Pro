#!/bin/bash
# Startup script for Render Native Environment
# This script installs Chrome manually if not in Docker, then starts the app.

echo "Installing dependencies..."
npm ci

if [ "$RENDER" = "true" ]; then
    echo "Detected Render environment. Installing Chrome..."
    # Install Chrome for Puppeteer
    npx puppeteer browsers install chrome

    # Find and export the Chrome executable path
    CHROME_PATH=$(find /opt/render -name "chrome" -type f 2>/dev/null | head -1)
    if [ -z "$CHROME_PATH" ]; then
        CHROME_PATH=$(find $HOME/.cache/puppeteer -name "chrome" -type f 2>/dev/null | head -1)
    fi
    if [ -n "$CHROME_PATH" ]; then
        echo "Chrome found at: $CHROME_PATH"
        export PUPPETEER_EXECUTABLE_PATH="$CHROME_PATH"
    else
        echo "WARNING: Chrome executable not found!"
    fi
else
    echo "Local or Docker environment detected. Skipping explicit Chrome install."
fi

# Start the application
echo "Starting application..."
npm start
