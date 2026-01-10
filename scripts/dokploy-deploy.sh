#!/bin/bash

# Dokploy Deployment Script with Aggressive Cache Clearing
# This script ensures a completely fresh build for Dokploy deployments

set -e

echo "🚀 Starting Dokploy deployment with cache clearing..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Clear all caches
print_header "Step 1: Clearing All Caches"
bash scripts/clear-all-caches.sh

# Step 2: Verify clean state
print_header "Step 2: Verifying Clean State"
if [ -d ".next" ]; then
    print_error ".next directory still exists!"
    exit 1
fi
if [ -d "node_modules" ]; then
    print_error "node_modules directory still exists!"
    exit 1
fi
print_status "Clean state verified"

# Step 3: Install dependencies
print_header "Step 3: Installing Dependencies"
echo "Installing with pnpm..."
pnpm install --frozen-lockfile
print_status "Dependencies installed"

# Step 4: Generate Prisma Client
print_header "Step 4: Generating Prisma Client"
pnpm prisma generate
print_status "Prisma Client generated"

# Step 5: Build application
print_header "Step 5: Building Application"
echo "Building Next.js application..."
pnpm build
print_status "Application built successfully"

# Step 6: Verify build output
print_header "Step 6: Verifying Build Output"
if [ ! -d ".next" ]; then
    print_error "Build failed: .next directory not found!"
    exit 1
fi
if [ ! -f ".next/BUILD_ID" ]; then
    print_error "Build failed: BUILD_ID not found!"
    exit 1
fi
BUILD_ID=$(cat .next/BUILD_ID)
print_status "Build verified (Build ID: $BUILD_ID)"

# Step 7: Summary
print_header "Deployment Summary"
echo ""
echo -e "${GREEN}✓ All caches cleared${NC}"
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo -e "${GREEN}✓ Application built successfully${NC}"
echo -e "${GREEN}✓ Build output verified${NC}"
echo ""
echo -e "${BLUE}🎉 Ready for deployment!${NC}"
echo ""