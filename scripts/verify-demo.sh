#!/bin/bash

# Verify Demo Files Script
# Ensures demo files are in sync with dist files

set -e

echo "🔍 Verifying demo files are up to date..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if dist files exist
if [ ! -f "dist/hoverzoom.umd.js" ] || [ ! -f "dist/hoverzoom.umd.min.js" ] || [ ! -f "dist/hoverzoom.min.css" ]; then
    print_warning "Dist files not found. Building..."
    pnpm run build
    exit 0
fi

# Check if demo files exist
if [ ! -f "demo/hoverzoom.umd.js" ] || [ ! -f "demo/hoverzoom.umd.min.js" ] || [ ! -f "demo/hoverzoom.min.css" ]; then
    print_warning "Demo files not found. Copying from dist..."
    pnpm run demo:copy
    exit 0
fi

# Compare file hashes to check if they're in sync
hash_dist_umd=$(shasum -a 256 dist/hoverzoom.umd.js | awk '{print $1}')
hash_demo_umd=$(shasum -a 256 demo/hoverzoom.umd.js | awk '{print $1}')

hash_dist_umd_min=$(shasum -a 256 dist/hoverzoom.umd.min.js | awk '{print $1}')
hash_demo_umd_min=$(shasum -a 256 demo/hoverzoom.umd.min.js | awk '{print $1}')

hash_dist_css=$(shasum -a 256 dist/hoverzoom.min.css | awk '{print $1}')
hash_demo_css=$(shasum -a 256 demo/hoverzoom.min.css | awk '{print $1}')

OUTDATED=false

if [ "$hash_dist_umd" != "$hash_demo_umd" ]; then
    print_error "demo/hoverzoom.umd.js is outdated!"
    OUTDATED=true
fi

if [ "$hash_dist_umd_min" != "$hash_demo_umd_min" ]; then
    print_error "demo/hoverzoom.umd.min.js is outdated!"
    OUTDATED=true
fi

if [ "$hash_dist_css" != "$hash_demo_css" ]; then
    print_error "demo/hoverzoom.min.css is outdated!"
    OUTDATED=true
fi

if [ "$OUTDATED" = true ]; then
    echo ""
    print_warning "Demo files are out of sync with dist files!"
    echo "Run: pnpm run demo:copy"
    echo "Or:  pnpm run build"
    exit 1
fi

print_success "All demo files are up to date!"
exit 0
