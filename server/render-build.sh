#!/bin/bash
# Startup script for Render Native Environment

echo "Installing dependencies..."
npm ci

# Clean up any old Puppeteer cache outside the project
rm -rf ~/.cache/puppeteer 2>/dev/null
rm -rf ./puppeteer-cache-dir 2>/dev/null

# Start the application
echo "Starting application..."
npm start

