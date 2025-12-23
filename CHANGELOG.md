## [2.2.0] - 2025-12-23

### Fixed

- **Critical zoom functionality bug** - Fixed magnifier image transform not being applied correctly
- Transform for `magnifierImageElement` now properly applied for both inside and outside zoom types
- Restored correct behavior where magnifier lens follows mouse movement smoothly

### Changed

- **Enabled TypeScript strict mode** - Full strict type checking for enhanced code quality
- Enabled all strict compiler options: `strict`, `noUnusedLocals`, `noUnusedParameters`
- Fixed all strict mode type errors with proper null checks and type assertions
- Removed unused `isSafari` property and related browser detection code
- Updated test suite to align with strict mode changes (40 unit tests passing)

### Developer Experience

- All TypeScript strict checks now enabled for maximum type safety
- Definite assignment assertions (`!`) used for class properties initialized in `init()`
- Non-null assertions used where DOM elements are guaranteed to exist
- Improved code quality with no unused variables or parameters

## [1.9.0] - 2025-12-21

### Changed

- **Migrated to TypeScript** - Complete TypeScript migration with full type safety
- Source code now written in TypeScript (`HoverZoom.ts`)
- Type definitions automatically generated from source code
- Enhanced IDE support with inline type hints and autocomplete
- Gradual migration strategy allows coexistence of JS/TS files during development

### Developer Experience

- Added `tsconfig.json` with gradual migration settings
- Updated build pipeline to compile TypeScript via Rollup
- All class properties, methods, and parameters now fully typed
- Type-safe interfaces for `HoverZoomOptions` and `HoverZoomClassNames`
- Improved code maintainability with explicit type annotations

## [1.8.0] - 2025-12-01

### Added

- Performance optimizations with throttle for mousemove events (configurable via `throttleDelay` option, default 16ms/60fps)
- RequestAnimationFrame for smooth animations with GPU acceleration (translate3d)
- DOM caching system using Map for reduced DOM queries
- Image preloading with lazy loading support
- `destroy()` method for proper cleanup and memory management
- Comprehensive test suite with Jest (29 unit tests, 95%+ coverage)
- End-to-end testing with Playwright across Chromium, Firefox, and WebKit
- Complete deployment automation scripts (lint → test → build → publish)
- TypeScript declaration file (.d.ts) for better IDE support
- Testing documentation (TESTING.md)
- Deployment documentation (DEPLOYMENT.md)

### Changed

- Refactored to immutable patterns (const over let)
- Cached image dimensions to avoid repeated reflows
- Combined background-position-x and background-position-y into single property
- Pre-calculated constants for better performance (multipliers, transforms)
- Enhanced error handling with console warnings for failed image loads

### Fixed

- Deep merge bug for nested classNames options
- Async test timing issues with requestAnimationFrame
- Jest configuration typo (coverageThreshold)
- E2E test timing and opacity checks with proper tolerances

### Performance

- ~60fps smooth animation with throttled mousemove handler
- Reduced DOM reflows by caching dimensions and references
- GPU-accelerated transforms for better rendering performance
- Lazy image loading to reduce initial load time

## [1.7.0] - 2025-08-19

### Changed

- Replaced node-sass with sass

## [1.6.1] - 2025-08-19

### Fixed

- Included typing (d.ts) for typescript use

## [1.6.0] - 2025-08-19

### Added

- Added typing (d.ts) for typescript use

## [1.5.1] - 2025-08-19

### Fixed

- Fixed bug position from left to right

## [1.5.0] - 2025-08-19

### Fixed

- Fixed ESM build bug that caused import errors in some environments

## [1.4.0] - 2025-08-19

### Added

- Improved accessibility for keyboard users
- Added more robust error handling for missing or invalid image elements
- Enhanced documentation and usage examples

### Changed

- Further code cleanup and minor performance optimizations

## [1.3.0] - 2025-08-18

### Changed

- Refactored internal logic to eliminate unnecessary mutable state
- Removed unused parameters (`iteration`, `container`) from internal methods
- All DOM operations now use local variables and parentNode references
- Codebase is now cleaner and more maintainable

## [1.2.0] - 2025-08-16

### Added

- ESM and UMD build outputs for broader compatibility
- Improved demo page and documentation
- Enhanced initialization to support more flexible usage

### Changed

- Refactored code for better modularity and maintainability

## [1.1.2] - 2025-08-16

### Fixed

- Minor bug fixes and code cleanup

## [1.1.1] - 2025-08-16

### Changed

- Improved TypeScript type safety and fixed build warnings
- Updated documentation and usage examples

## [1.1.0] - 2025-08-16

### Changed

- Refactored codebase for better readability and maintainability
- Improved initialization to support DOMContentLoaded event
- Enhanced modularity and code structure for easier extension

## [1.0.0] - 2025-08-16

### Added

- Initial release of HoverZoom plugin (v1.0.0)
- Pure JavaScript image zoom on hover, no dependencies
- Supports both 'inside' and 'outside' zoom types
- Configurable options: position, type, blur, grayscale, large image source
- Works with multiple images on a page
- Modern, modular, and readable codebase
- Browser compatibility: Chrome, Firefox, Safari, Opera
