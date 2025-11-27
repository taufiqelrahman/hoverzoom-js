# Testing Documentation

## Overview

This project includes comprehensive testing with both unit tests and end-to-end (e2e) tests to ensure code quality and functionality.

## Test Coverage

Current coverage targets: **80%** minimum across all metrics (branches, functions, lines, statements)

## Running Tests

### Unit Tests (Jest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run e2e tests (headless)
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run e2e tests in headed mode (see browser)
npm run test:e2e:headed
```

### Run All Tests

```bash
# Run both unit and e2e tests
npm run test:all
```

## Test Structure

### Unit Tests

- **Location:** `src/HoverZoom.test.js`
- **Framework:** Jest with jsdom environment
- **Coverage:**
  - Constructor and initialization
  - Option merging and validation
  - DOM manipulation methods
  - Event handlers (mousemove, mouseout)
  - Filter applications (blur, grayscale)
  - Data attributes handling
  - Edge cases and error scenarios

### E2E Tests

- **Location:** `e2e/hoverzoom.spec.js`
- **Framework:** Playwright
- **Browsers:** Chromium, Firefox, WebKit (Safari)
- **Coverage:**
  - User interactions (hover, mouse movements)
  - Visual rendering and animations
  - Multiple instances handling
  - Responsive behavior
  - Accessibility features
  - Performance metrics
  - Cross-browser compatibility

## Test Configuration

### Jest Configuration (`jest.config.js`)

- Environment: jsdom (browser simulation)
- Coverage thresholds: 80% for all metrics
- Module name mapping for CSS/SCSS files
- Setup file for DOM mocks

### Playwright Configuration (`playwright.config.js`)

- Runs tests against local demo server
- Multiple browser configurations
- Screenshot on failure
- Trace collection for debugging

## CI/CD Integration

Tests run automatically on:

- Every push to `master` or `develop` branches
- Every pull request
- Multiple Node.js versions (18.x, 20.x, 22.x)

Coverage reports are uploaded to Codecov for tracking.

## Writing Tests

### Unit Test Example

```javascript
test("should create instance with default options", () => {
  const hoverZoom = new HoverZoom();
  expect(hoverZoom.options.position).toBe("right");
});
```

### E2E Test Example

```javascript
test("should show magnifier on hover", async ({ page }) => {
  const image = page.locator(".hoverzoom-image").first();
  await image.hover();
  const magnifier = page.locator(".hoverzoom-magnifier").first();
  await expect(magnifier).toHaveCSS("opacity", "1");
});
```

## Coverage Reports

After running tests with coverage, open the HTML report:

```bash
open coverage/lcov-report/index.html
```

## Troubleshooting

### Unit Tests Failing

- Ensure Node.js version 18+ is installed
- Clear Jest cache: `npx jest --clearCache`
- Check for console errors in test output

### E2E Tests Failing

- Ensure Playwright browsers are installed: `npx playwright install`
- Check if demo server starts properly
- Review screenshots in `test-results/` folder
- Run with headed mode to see what's happening

### Coverage Not Meeting Threshold

- Check coverage report to see uncovered lines
- Add tests for missing scenarios
- Review complex branches that need testing

## Best Practices

1. **Keep tests isolated** - Each test should be independent
2. **Use descriptive test names** - Clearly state what is being tested
3. **Test edge cases** - Include error scenarios and boundary conditions
4. **Mock appropriately** - Mock external dependencies but not core logic
5. **Maintain tests** - Update tests when functionality changes
6. **Review coverage** - Regularly check coverage reports

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
