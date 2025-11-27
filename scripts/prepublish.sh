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

# Check for required files
REQUIRED_FILES=(
    "dist/hoverzoom.umd.min.js"
    "dist/hoverzoom.esm.min.js"
    "dist/hoverzoom.min.css"
    "dist/hoverzoom.d.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file $file not found"
        exit 1
    fi
done

echo "✓ All required files present"
echo "✓ Pre-publish checks passed"
