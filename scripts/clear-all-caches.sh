#!/bin/bash

# Clear All Caches Script for Dokploy Deployment
# This script aggressively clears all possible caches before deployment

set -e

echo "🧹 Starting comprehensive cache clearing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Clear Next.js build cache
print_status "Clearing Next.js build cache..."
rm -rf .next 2>/dev/null || true
rm -rf out 2>/dev/null || true
print_status "Next.js cache cleared"

# 2. Clear node_modules (aggressive)
print_status "Clearing node_modules..."
rm -rf node_modules 2>/dev/null || true
print_status "node_modules cleared"

# 3. Clear pnpm cache
print_status "Clearing pnpm cache..."
pnpm store prune 2>/dev/null || print_warning "pnpm not available, skipping pnpm cache"

# 4. Clear npm cache (if npm is used)
print_status "Clearing npm cache..."
npm cache clean --force 2>/dev/null || print_warning "npm not available, skipping npm cache"

# 5. Clear TypeScript build info
print_status "Clearing TypeScript build info..."
rm -rf tsconfig.tsbuildinfo 2>/dev/null || true
rm -rf .tsbuildinfo 2>/dev/null || true
print_status "TypeScript cache cleared"

# 6. Clear ESLint cache
print_status "Clearing ESLint cache..."
rm -rf .eslintcache 2>/dev/null || true
print_status "ESLint cache cleared"

# 7. Clear Prisma generated files
print_status "Clearing Prisma generated files..."
rm -rf node_modules/.prisma 2>/dev/null || true
rm -rf node_modules/@prisma 2>/dev/null || true
print_status "Prisma cache cleared"

# 8. Clear any .turbo cache (if using Turborepo)
print_status "Clearing Turbo cache..."
rm -rf .turbo 2>/dev/null || true
print_status "Turbo cache cleared"

# 9. Clear any temporary files
print_status "Clearing temporary files..."
rm -rf tmp 2>/dev/null || true
rm -rf temp 2>/dev/null || true
rm -rf .tmp 2>/dev/null || true
print_status "Temporary files cleared"

# 10. Clear any log files
print_status "Clearing log files..."
rm -rf *.log 2>/dev/null || true
rm -rf logs 2>/dev/null || true
print_status "Log files cleared"

# 11. Clear Next.js trace files
print_status "Clearing Next.js trace files..."
rm -rf .next/trace 2>/dev/null || true
print_status "Trace files cleared"

# 12. Clear any build artifacts
print_status "Clearing build artifacts..."
rm -rf dist 2>/dev/null || true
rm -rf build 2>/dev/null || true
print_status "Build artifacts cleared"

echo ""
echo "✨ All caches cleared successfully!"
echo ""
echo "📦 Next steps:"
echo "   1. Run: pnpm install"
echo "   2. Run: pnpm build"
echo "   3. Deploy to Dokploy"
echo ""