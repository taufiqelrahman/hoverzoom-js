#!/bin/bash

# Build all script - Complete build process
# Runs all steps needed to prepare the project

set -e

echo "🔨 Building hoverzoom-js..."
echo ""

# Clean
echo "Cleaning dist directory..."
rm -rf dist
mkdir -p dist

# Lint
echo "Running linter..."
pnpm run lint

# Compile SCSS
echo "Compiling SCSS..."
pnpm run scss

# Bundle with Rollup
echo "Bundling with Rollup..."
pnpm exec rollup -c

# Generate type definitions
echo "Generating type definitions..."
pnpm run types

# Rename type definition files to lowercase
echo "Renaming type definitions..."
mv dist/HoverZoom.d.ts dist/hoverzoom.d.ts 2>/dev/null || true
mv dist/HoverZoom.d.ts.map dist/hoverzoom.d.ts.map 2>/dev/null || true

# Minify
echo "Minifying assets..."
pnpm run minify

# Update demo
echo "Updating demo files..."
pnpm run demo:copy

# Verify demo files
echo "Verifying demo files..."
pnpm run demo:verify

echo ""
echo "✨ Build completed successfully!"
echo ""
echo "Generated files:"
ls -lh dist/
