#!/bin/bash

# Verify package script - Check package before publishing
# Useful for dry-run verification

set -e

echo "🔍 Verifying package..."
echo ""

# Check package.json validity
echo "Checking package.json..."
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"
echo "✓ package.json is valid"

# List files that will be included in package
echo ""
echo "Files to be published:"
npm pack --dry-run

# Show package size
echo ""
echo "Checking package size..."
TARBALL=$(npm pack)
SIZE=$(du -h $TARBALL | cut -f1)
echo "Package size: $SIZE"
rm $TARBALL

# Check for common issues
echo ""
echo "Checking for common issues..."

if [ ! -f "README.md" ]; then
    echo "⚠ Warning: No README.md found"
fi

if [ ! -f "LICENSE" ]; then
    echo "⚠ Warning: No LICENSE file found"
fi

if [ ! -f "CHANGELOG.md" ]; then
    echo "⚠ Warning: No CHANGELOG.md found"
fi

echo ""
echo "✓ Package verification complete"
