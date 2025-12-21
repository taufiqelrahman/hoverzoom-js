#!/bin/bash

# Deploy Script for hoverzoom-js
# This script handles the complete deployment process to npm

set -e  # Exit on error

echo "🚀 Starting deployment process for hoverzoom-js..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if we're on master branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
    print_error "You must be on master branch to deploy. Current branch: $CURRENT_BRANCH"
    exit 1
fi
print_step "On master branch"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_error "You have uncommitted changes. Please commit or stash them first."
    git status -s
    exit 1
fi
print_step "No uncommitted changes"

# Pull latest changes
print_info "Pulling latest changes from remote..."
git pull origin master
print_step "Repository up to date"

# Run linter
print_info "Running linter..."
pnpm run lint
print_step "Linting passed"

# Run tests
print_info "Running unit tests with coverage..."
pnpm run test:coverage
print_step "Unit tests passed"

print_info "Running e2e tests..."
pnpm run test:e2e
print_step "E2E tests passed"

# Clean dist directory
print_info "Cleaning dist directory..."
rm -rf dist
mkdir -p dist
print_step "Dist directory cleaned"

# Build project
print_info "Building project..."
pnpm run build
print_step "Build completed"

# Minify assets
print_info "Minifying assets..."
pnpm run minify
print_step "Minification completed"

# Update demo files
print_info "Updating demo files..."
pnpm run demo:copy
print_step "Demo files updated"

# Verify demo files
print_info "Verifying demo files are in sync..."
pnpm run demo:verify
print_step "Demo files verified"

# Check package.json version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: $CURRENT_VERSION"

# Ask for version bump type
echo ""
echo "Select version bump type:"
echo "1) patch (1.7.0 -> 1.7.1) - Bug fixes"
echo "2) minor (1.7.0 -> 1.8.0) - New features"
echo "3) major (1.7.0 -> 2.0.0) - Breaking changes"
echo "4) skip version bump"
echo ""
read -p "Enter choice [1-4]: " VERSION_CHOICE

case $VERSION_CHOICE in
    1)
        pnpm version patch -m "chore: bump version to %s"
        ;;
    2)
        pnpm version minor -m "chore: bump version to %s"
        ;;
    3)
        pnpm version major -m "chore: bump version to %s"
        ;;
    4)
        print_info "Skipping version bump"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
if [ "$NEW_VERSION" != "$CURRENT_VERSION" ]; then
    print_step "Version bumped from $CURRENT_VERSION to $NEW_VERSION"
fi

# Verify package contents
print_info "Verifying package contents..."
pnpm pack --dry-run
print_step "Package verification complete"

# Ask for confirmation
echo ""
print_info "Ready to publish version $NEW_VERSION to npm"
read -p "Do you want to continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    print_error "Deployment cancelled"
    exit 1
fi

# Publish to npm
print_info "Publishing to npm..."
pnpm publish

print_step "Successfully published to npm!"

# Push tags to git
print_info "Pushing tags to git..."
git push origin master --tags

print_step "Tags pushed to repository"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✨ Deployment Successful! ✨${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Version $NEW_VERSION has been published to npm"
echo "View at: https://www.npmjs.com/package/hoverzoom-js"
echo ""
