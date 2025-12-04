# Build & Demo Sync Workflow

## Overview

This project has automated systems to ensure demo files are always in sync with the latest built files.

## How It Works

### Automatic Demo Updates

When you run **any** build command, demo files are automatically updated:

```bash
pnpm run build        # Builds + updates demo files
pnpm run build:all    # Full build + verifies demo files
pnpm run dev          # Builds + updates demo + starts server
```

### Scripts

#### Build Scripts
- `pnpm run build` - Lint → SCSS → Rollup → Minify → **Auto-update demo**
- `pnpm run build:all` - Full build with verification
- `pnpm run minify` - Minify CSS and JS only
- `pnpm run scss` - Compile SCSS only

#### Demo Scripts
- `pnpm run demo:copy` - Copy built files to demo folder
- `pnpm run demo:verify` - Verify demo files are in sync with dist
- `pnpm run demo:dev` - Build + start dev server at http://localhost:8080
- `pnpm run dev` - Alias for demo:dev

#### Verification
- `pnpm run demo:verify` - Checks if demo files match dist files using SHA256 hashes

### Pre-Commit Hook

A Git hook automatically runs before every commit to ensure demo files are up to date:

```bash
# Automatically runs on: git commit
# If src/ files changed → Verifies demo files are in sync
# If outdated → Blocks commit with instructions
```

### Deployment

The deploy script (`pnpm run deploy`) includes verification:

1. Runs tests
2. Builds project
3. Updates demo files
4. **Verifies demo files are in sync**
5. Publishes to npm
6. Pushes to Git with tags

### Pre-Publish Hook

Before publishing to npm, `prepublishOnly` automatically:

1. Checks all required dist files exist
2. Checks all required demo files exist
3. **Verifies demo files are in sync**

## Preventing Outdated Demo Files

### ✅ Automated Protection

1. **Build integration** - `pnpm run build` automatically updates demo
2. **Pre-commit hook** - Git blocks commits if demo is outdated
3. **Pre-publish check** - npm publish fails if demo is outdated
4. **Deploy script** - Verifies before deployment

### 🔍 Manual Verification

Check if demo files are in sync:

```bash
pnpm run demo:verify
```

Expected output:
```
🔍 Verifying demo files are up to date...
✓ All demo files are up to date!
```

If outdated:
```
✗ demo/hoverzoom.umd.js is outdated!
⚠ Demo files are out of sync with dist files!
Run: pnpm run demo:copy
Or:  pnpm run build
```

## Workflow Examples

### Development

```bash
# Make changes to src/HoverZoom.js
vim src/HoverZoom.js

# Build (automatically updates demo)
pnpm run build

# Test in browser
pnpm run dev

# Commit (pre-commit hook verifies demo)
git add .
git commit -m "feat: add new feature"  # Hook runs automatically
git push
```

### Quick Fix Demo Files

If demo files are out of sync:

```bash
# Option 1: Just copy files
pnpm run demo:copy

# Option 2: Full rebuild
pnpm run build

# Then commit
git add demo/
git commit -m "chore: update demo files"
```

### Publishing to npm

```bash
pnpm run deploy
# ✓ Automatically verifies demo files before publishing
```

## File Structure

```
hoverzoom-js/
├── src/
│   ├── HoverZoom.js       # Source code
│   └── style.scss         # Source styles
├── dist/                  # Built files (for npm)
│   ├── hoverzoom.umd.js
│   ├── hoverzoom.umd.min.js
│   ├── hoverzoom.esm.js
│   ├── hoverzoom.esm.min.js
│   └── hoverzoom.min.css
├── demo/                  # Demo files (for Vercel)
│   ├── hoverzoom.umd.js      ← Must match dist/
│   ├── hoverzoom.umd.min.js  ← Must match dist/
│   ├── hoverzoom.min.css     ← Must match dist/
│   └── index.html
└── scripts/
    ├── build-all.sh       # Full build + verify
    ├── deploy.sh          # Deploy with verification
    ├── verify-demo.sh     # Hash-based verification
    └── prepublish.sh      # Pre-publish checks
```

## Troubleshooting

### "Demo files are outdated" error

```bash
# Quick fix
pnpm run build

# Or if that fails
rm -rf dist demo/*.js demo/*.css
pnpm run build:all
```

### Pre-commit hook not running

```bash
# Reinstall husky
chmod +x .husky/pre-commit

# Or skip hook (not recommended)
git commit --no-verify
```

### Vercel deployment showing old code

This should never happen now because:
1. Build process auto-updates demo
2. Pre-commit hook blocks outdated commits
3. Vercel deploys from demo/ folder

If it does happen:
```bash
pnpm run build
git add demo/
git commit -m "fix: update demo files"
git push
```

## Summary

**You don't need to manually run `demo:copy` anymore!**

Just use `pnpm run build` and everything is handled automatically. The pre-commit hook and verification scripts ensure demo files can never become outdated.
