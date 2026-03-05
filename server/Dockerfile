FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install dependencies and fix permissions
USER root

# Environment variables to skip chromium download since we use the one installed in the base image
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Ensure the pptruser has ownership of the app directory
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to non-root user for security
USER pptruser

# Expose port
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
