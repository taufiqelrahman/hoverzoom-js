# HoverZoom Test Suite

Test suite organized by feature area for better maintainability.

## Test Files

### [test-utils.ts](test-utils.ts)

Shared test utilities and helper functions used across all test files:

- `setupTestContainer()` - Creates standard test DOM structure
- `cleanupTestContainer()` - Cleans up test DOM
- `createMouseEvent()` - Helper for creating mouse events
- `createKeyboardEvent()` - Helper for creating keyboard events
- `waitForAnimationFrame()` - Promise-based RAF helper

### [HoverZoom.basic.test.ts](HoverZoom.basic.test.ts) - 17 tests

Basic functionality tests:

- Constructor and option merging (3 tests)
- Initialization (3 tests)
- Data attributes (3 tests)
- Edge cases (3 tests)
- Throttle delay configuration (2 tests)

### [HoverZoom.zoom.test.ts](HoverZoom.zoom.test.ts) - 9 tests

Zoom type functionality:

- Outside zoom (6 tests)
- Inside zoom (3 tests)

### [HoverZoom.mouse.test.ts](HoverZoom.mouse.test.ts) - 10 tests

Mouse event handling:

- Mouse events for outside type (8 tests)
- Mouse events for inside type (2 tests)

### [HoverZoom.keyboard.test.ts](HoverZoom.keyboard.test.ts) - 8 tests

Keyboard navigation:

- Enter/Space to activate
- Escape to deactivate
- Focus management
- Keyboard with filters

### [HoverZoom.accessibility.test.ts](HoverZoom.accessibility.test.ts) - 14 tests

Accessibility compliance:

- ARIA attributes (5 tests)
- Screen reader support (9 tests)

### [HoverZoom.performance.test.ts](HoverZoom.performance.test.ts) - 8 tests

Performance optimizations:

- Image preloading (3 tests)
- Event throttling (1 test)
- RequestAnimationFrame (2 tests)
- DOM caching (2 tests)

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test HoverZoom.basic.test.ts

# Run with coverage
pnpm test:coverage
```

## Total: 62 tests

All tests passing with 96.34% coverage.
