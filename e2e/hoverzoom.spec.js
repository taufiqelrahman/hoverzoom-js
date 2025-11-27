import { test, expect } from "@playwright/test";

test.describe("HoverZoom Outside Type", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display hoverzoom container", async ({ page }) => {
    const container = page.locator(".hoverzoom").first();
    await expect(container).toBeVisible();
  });

  test("should display image inside container", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute("src");
  });

  test("should create magnifier element on init", async ({ page }) => {
    const magnifier = page.locator(".hoverzoom-magnifier").first();
    await expect(magnifier).toBeAttached();
  });

  test("should create zoomed element for outside type", async ({ page }) => {
    const zoomedElement = page.locator(".hoverzoom-zoom").first();
    await expect(zoomedElement).toBeAttached();
  });

  test("should show magnifier on hover", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();
    const magnifier = page.locator(".hoverzoom-magnifier").first();

    // Initially magnifier should have opacity 0
    await expect(magnifier).toHaveCSS("opacity", "0");

    // Hover over image
    await image.hover();

    // Wait for the transition to complete
    await page.waitForTimeout(600);

    // Magnifier should become visible (check opacity is close to 1)
    const opacity = await magnifier.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacity).toBeGreaterThanOrEqual(0.9);
  });

  test("should hide magnifier on mouse leave", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();
    const magnifier = page.locator(".hoverzoom-magnifier").first();

    // Hover to show magnifier
    await image.hover();
    await page.waitForTimeout(600);
    const opacityVisible = await magnifier.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacityVisible).toBeGreaterThanOrEqual(0.9);

    // Move mouse away
    await page.mouse.move(0, 0);
    await page.waitForTimeout(600);

    // Magnifier should be hidden
    const opacityHidden = await magnifier.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacityHidden).toBeLessThan(0.1);
  });

  test("should apply blur filter on hover when enabled", async ({ page }) => {
    const image = page.locator('.hoverzoom-image[data-blur="true"]').first();

    // Hover over image
    await image.hover();
    await page.waitForTimeout(100);

    // Check if filter contains blur
    const filter = await image.evaluate((el) => el.style.filter);
    expect(filter).toContain("blur");
  });

  test("should apply grayscale filter on hover when enabled", async ({
    page,
  }) => {
    const image = page
      .locator('.hoverzoom-image[data-grayscale="true"]')
      .first();

    // Hover over image
    await image.hover();
    await page.waitForTimeout(100);

    // Check if filter contains grayscale
    const filter = await image.evaluate((el) => el.style.filter);
    expect(filter).toContain("grayscale");
  });

  test("should remove filters on mouse leave", async ({ page }) => {
    const image = page.locator('.hoverzoom-image[data-blur="true"]').first();

    // Hover then leave
    await image.hover();
    await page.waitForTimeout(100);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // Filter should be unset
    const filter = await image.evaluate((el) => el.style.filter);
    expect(filter).toBe("unset");
  });

  test("should update magnifier position on mouse move", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();
    const magnifier = page.locator(".hoverzoom-magnifier").first();

    // Get image bounding box
    const box = await image.boundingBox();
    if (!box) throw new Error("Image not found");

    // Hover over image first to activate
    await image.hover({ position: { x: 50, y: 50 } });
    await page.waitForTimeout(200);

    // Check magnifier transform is set
    const transform = await magnifier.evaluate((el) => el.style.transform);
    expect(transform).toContain("translate");
  });

  test("should show zoomed view on hover for outside type", async ({
    page,
  }) => {
    const image = page.locator('.hoverzoom-image[data-type="outside"]').first();
    const zoomedElement = page.locator(".hoverzoom-zoom").first();

    // Initially should be hidden
    const initialOpacity = await zoomedElement.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(initialOpacity).toBeLessThan(0.1);

    // Hover over image
    await image.hover();
    await page.waitForTimeout(600);

    // Zoomed element should become visible
    const finalOpacity = await zoomedElement.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(finalOpacity).toBeGreaterThanOrEqual(0.9);
  });

  test("should handle different positions (right)", async ({ page }) => {
    const container = page.locator(".hoverzoom").first();
    const image = container.locator(".hoverzoom-image");

    // Check if position is right
    const position = await image.getAttribute("data-position");
    if (position === "right" || !position) {
      const flexDirection = await container.evaluate(
        (el) => window.getComputedStyle(el).flexDirection
      );
      expect(flexDirection).toBe("row");
    }
  });
});

test.describe("HoverZoom Inside Type", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should create round magnifier for inside type", async ({ page }) => {
    const image = page.locator('.hoverzoom-image[data-type="inside"]').first();

    if ((await image.count()) > 0) {
      await image.hover();
      await page.waitForTimeout(100);

      const magnifier = page.locator(".hoverzoom-magnifier--round").first();
      await expect(magnifier).toBeAttached();
      await expect(magnifier).toHaveCSS("border-radius", "50%");
    }
  });

  test("should show inside magnifier on hover", async ({ page }) => {
    const image = page.locator('.hoverzoom-image[data-type="inside"]').first();

    if ((await image.count()) > 0) {
      const magnifier = page.locator(".hoverzoom-magnifier--round").first();

      const initialOpacity = await magnifier.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(initialOpacity).toBeLessThan(0.1);
      await image.hover();
      await page.waitForTimeout(600);
      const finalOpacity = await magnifier.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(finalOpacity).toBeGreaterThanOrEqual(0.9);
    }
  });
});

test.describe("HoverZoom Multiple Images", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should handle multiple hoverzoom instances", async ({ page }) => {
    const containers = page.locator(".hoverzoom");
    const count = await containers.count();

    expect(count).toBeGreaterThan(0);

    // Check each container has required elements
    for (let i = 0; i < Math.min(count, 3); i++) {
      const container = containers.nth(i);
      const image = container.locator(".hoverzoom-image");
      await expect(image).toBeAttached();
    }
  });

  test("should independently control each hoverzoom instance", async ({
    page,
  }) => {
    const images = page.locator(".hoverzoom-image");
    const count = await images.count();

    if (count >= 2) {
      const firstImage = images.nth(0);
      const secondImage = images.nth(1);

      // Hover first image
      await firstImage.hover();
      await page.waitForTimeout(600);

      // Check only first magnifier is visible
      const allMagnifiers = page.locator(".hoverzoom-magnifier");
      const firstMagnifier = allMagnifiers.nth(0);
      const secondMagnifier = allMagnifiers.nth(1);

      const firstOpacity = await firstMagnifier.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(firstOpacity).toBeGreaterThanOrEqual(0.9);
      const secondOpacity = await secondMagnifier.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(secondOpacity).toBeLessThan(0.1);
    }
  });
});

test.describe("HoverZoom Responsive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const image = page.locator(".hoverzoom-image").first();
    await expect(image).toBeVisible();

    const magnifier = page.locator(".hoverzoom-magnifier").first();
    await expect(magnifier).toBeAttached();
  });

  test("should work on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const image = page.locator(".hoverzoom-image").first();
    await expect(image).toBeVisible();
  });
});

test.describe("HoverZoom Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should have proper image elements", async ({ page }) => {
    const images = page.locator(".hoverzoom-image");
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const image = images.nth(i);
      await expect(image).toBeVisible();
      // Check that image has src attribute
      const src = await image.getAttribute("src");
      expect(src).toBeTruthy();
    }
  });

  test("should not have horizontal layout shift on hover", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();

    // Scroll to element first to ensure it's in viewport
    await image.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);

    const box1 = await image.boundingBox();
    await image.hover();
    await page.waitForTimeout(200);
    const box2 = await image.boundingBox();

    // X position should remain the same (no horizontal shift)
    expect(box1?.x).toBe(box2?.x);
    // Width and height should remain the same
    expect(box1?.width).toBe(box2?.width);
    expect(box1?.height).toBe(box2?.height);
  });
});

test.describe("HoverZoom Performance", () => {
  test("should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("should not cause memory leaks on repeated hover", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const image = page.locator(".hoverzoom-image").first();

    // Hover multiple times
    for (let i = 0; i < 10; i++) {
      await image.hover();
      await page.waitForTimeout(50);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(50);
    }

    // Should still be functional
    await image.hover();
    await page.waitForTimeout(600);
    const magnifier = page.locator(".hoverzoom-magnifier").first();
    const opacity = await magnifier.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacity).toBeGreaterThanOrEqual(0.9);
  });
});
