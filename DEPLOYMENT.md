# Deployment Guide

Complete guide for deploying hoverzoom-js to npm.

## Prerequisites

1. **Node.js 18+** installed
2. **npm account** with access to publish hoverzoom-js
3. **Git repository** up to date
4. **On master branch** with no uncommitted changes

## Quick Deploy (Automated)

Run the complete deployment script:

```bash
npm run verify          # Verify package first
npm run deploy          # Interactive deployment
```

This will:

1. ✅ Check you're on master branch
2. ✅ Verify no uncommitted changes
3. ✅ Pull latest changes
4. ✅ Run linter
5. ✅ Run unit tests with coverage
6. ✅ Run e2e tests
7. ✅ Clean dist directory
8. ✅ Build project
9. ✅ Minify assets
10. ✅ Update demo files
11. ✅ Prompt for version bump (patch/minor/major)
12. ✅ Verify package contents
13. ✅ Publish to npm
14. ✅ Push git tags

## Manual Deploy (Step by Step)

If you prefer to run steps manually:

### 1. Pre-deployment Checks

```bash
# Ensure you're on master
git checkout master

# Check for uncommitted changes
git status

# Pull latest
git pull origin master
```

### 2. Run Tests

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### 3. Build & Minify

```bash
# Clean previous build
npm run clean

# Build everything
npm run build:all

# Or step by step:
npm run build
npm run minify
npm run demo
```

### 4. Verify Package

```bash
# Verify what will be published
npm run verify

# Dry run to see package contents
npm pack --dry-run
```

### 5. Update Version

Choose appropriate version bump:

```bash
# For bug fixes (1.7.0 -> 1.7.1)
npm run version:patch

# For new features (1.7.0 -> 1.8.0)
npm run version:minor

# For breaking changes (1.7.0 -> 2.0.0)
npm run version:major
```

### 6. Update Changelog

Edit `CHANGELOG.md` and add entry for new version:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added

- New features

### Changed

- Changes in existing functionality

### Fixed

- Bug fixes
```

### 7. Publish to npm

```bash
# Publish (will run prepublishOnly automatically)
npm publish

# For first time or if 2FA is enabled
npm login
npm publish
```

### 8. Push to Git

```bash
# Push code and tags
git push origin master --tags
```

## Version Bumping Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes

  - API changes that break backward compatibility
  - Removing features
  - Major refactoring

- **MINOR** (1.X.0): New features

  - New functionality added
  - New options or methods
  - Improvements without breaking changes

- **PATCH** (1.7.X): Bug fixes
  - Bug fixes
  - Documentation updates
  - Performance improvements
  - Minor tweaks

## Files Included in Package

The following files are published to npm (see `package.json` files field):

```
dist/
  ├── hoverzoom.umd.min.js    # UMD bundle for browsers
  ├── hoverzoom.esm.min.js    # ES Module bundle
  ├── hoverzoom.min.css       # Minified styles
  └── hoverzoom.d.ts          # TypeScript definitions
```

## Files Excluded from Package

See `.npmignore` for complete list. Excluded:

- Source files (`src/`)
- Tests (`e2e/`, `**/*.test.js`)
- Config files (rollup, jest, playwright, etc.)
- Development files (demo, coverage, etc.)

## Troubleshooting

### "You need to be logged in to publish"

```bash
npm login
```

### "You do not have permission to publish"

Check package name availability or your npm account permissions.

### "Version already exists"

You forgot to bump version. Run:

```bash
npm run version:patch  # or minor/major
```

### Build fails

```bash
# Clean everything and rebuild
npm run clean
npm run build:all
```

### Tests fail

Fix tests before deploying:

```bash
npm run test:coverage
npm run test:e2e
```

## Post-Deployment Checklist

After successful deployment:

- [ ] Verify package on npm: https://www.npmjs.com/package/hoverzoom-js
- [ ] Check version number is correct
- [ ] Test installation: `npm install hoverzoom-js@latest`
- [ ] Verify demo site works: https://hoverzoom-js.vercel.app
- [ ] Update GitHub release notes
- [ ] Announce update (if major/minor)

## Automation with CI/CD

The `.github/workflows/tests.yml` runs tests automatically on every push.

Consider adding GitHub Actions for automated publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  push:
    tags:
      - "v*"
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          registry-url: "https://registry.npmjs.org/"
      - run: npm ci
      - run: npm test
      - run: npm run build:all
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Quick Reference Commands

```bash
# Complete automated deploy
npm run deploy

# Build everything
npm run build:all

# Verify package
npm run verify

# Version bumps
npm run version:patch
npm run version:minor
npm run version:major

# Clean build artifacts
npm run clean

# Publish manually
npm publish
```

## Support

For issues or questions:

- GitHub Issues: https://github.com/taufiqelrahman/hoverzoom-js/issues
- npm: https://www.npmjs.com/package/hoverzoom-js
