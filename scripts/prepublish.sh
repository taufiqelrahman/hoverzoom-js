#!/bin/bash

# Pre-publish script
# This runs automatically before npm publish

set -e

echo "Running pre-publish checks..."

# Ensure we have dist directory
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found. Run npm run build first."
    exit 1
fi

# Check for required dist files
REQUIRED_DIST_FILES=(
    "dist/hoverzoom.umd.min.js"
    "dist/hoverzoom.esm.min.js"
    "dist/hoverzoom.min.css"
    "dist/hoverzoom.d.ts"
)

for file in "${REQUIRED_DIST_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file $file not found"
        exit 1
    fi
done

echo "✓ All required dist files present"

# Check for required demo files
REQUIRED_DEMO_FILES=(
    "demo/hoverzoom.umd.js"
    "demo/hoverzoom.umd.min.js"
    "demo/hoverzoom.min.css"
)

for file in "${REQUIRED_DEMO_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required demo file $file not found"
        exit 1
    fi
done

echo "✓ All required demo files present"

# Verify demo files are in sync
echo "Checking if demo files are in sync..."
bash scripts/verify-demo.sh

echo "✓ Pre-publish checks passed"
