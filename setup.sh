#!/bin/bash

# Setup script for cal.com submodule
# This script sets up the cal.com development environment

set -e  # Exit on any error

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ✗${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
log "Checking prerequisites..."

if ! command_exists yarn; then
    log_error "Yarn is not installed. Please install Yarn first."
    exit 1
fi

if ! command_exists node; then
    log_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

log_success "Prerequisites check passed"

# Step 1: Install dependencies
log "Installing dependencies with yarn..."
if yarn; then
    log_success "Dependencies installed successfully"
else
    log_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Build with increased memory allocation
log "Building project with increased memory allocation..."
if NODE_OPTIONS='--max-old-space-size=12288' yarn build; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Step 3: Setup database
log "Setting up database..."
cd packages/prisma

if yarn db-setup; then
    log_success "Database setup completed successfully"
else
    log_error "Database setup failed"
    exit 1
fi

# Return to original directory
cd ../..

log_success "Cal.com setup completed successfully!"
