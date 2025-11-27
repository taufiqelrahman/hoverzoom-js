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

    // Wait a bit for the animation
    await page.waitForTimeout(100);

    // Magnifier should become visible
    await expect(magnifier).toHaveCSS("opacity", "1");
  });

  test("should hide magnifier on mouse leave", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();
    const magnifier = page.locator(".hoverzoom-magnifier").first();

    // Hover to show magnifier
    await image.hover();
    await page.waitForTimeout(100);
    await expect(magnifier).toHaveCSS("opacity", "1");

    // Move mouse away
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // Magnifier should be hidden
    await expect(magnifier).toHaveCSS("opacity", "0");
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

    // Move to specific position on image
    await page.mouse.move(box.x + 50, box.y + 50);
    await page.waitForTimeout(100);

    // Check magnifier transform
    const transform = await magnifier.evaluate((el) => el.style.transform);
    expect(transform).toContain("translate");
  });

  test("should show zoomed view on hover for outside type", async ({
    page,
  }) => {
    const image = page.locator('.hoverzoom-image[data-type="outside"]').first();
    const zoomedElement = page.locator(".hoverzoom-zoom").first();

    // Initially should be hidden
    await expect(zoomedElement).toHaveCSS("opacity", "0");

    // Hover over image
    await image.hover();
    await page.waitForTimeout(100);

    // Zoomed element should become visible
    await expect(zoomedElement).toHaveCSS("opacity", "1");
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

      await expect(magnifier).toHaveCSS("opacity", "0");
      await image.hover();
      await page.waitForTimeout(100);
      await expect(magnifier).toHaveCSS("opacity", "1");
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
      await page.waitForTimeout(100);

      // Check only first magnifier is visible
      const allMagnifiers = page.locator(".hoverzoom-magnifier");
      const firstMagnifier = allMagnifiers.nth(0);
      const secondMagnifier = allMagnifiers.nth(1);

      await expect(firstMagnifier).toHaveCSS("opacity", "1");
      await expect(secondMagnifier).toHaveCSS("opacity", "0");
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

    // Tap on mobile
    await image.tap();
    await page.waitForTimeout(100);
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

  test("should have alt text on images", async ({ page }) => {
    const images = page.locator(".hoverzoom-image");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute("alt");
      // Alt can be empty string but should exist
      expect(alt).not.toBeNull();
    }
  });

  test("should not have layout shift on hover", async ({ page }) => {
    const image = page.locator(".hoverzoom-image").first();
    const box1 = await image.boundingBox();

    await image.hover();
    await page.waitForTimeout(200);

    const box2 = await image.boundingBox();

    // Position should remain the same
    expect(box1?.x).toBe(box2?.x);
    expect(box1?.y).toBe(box2?.y);
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
    const magnifier = page.locator(".hoverzoom-magnifier").first();
    await expect(magnifier).toHaveCSS("opacity", "1");
  });
});
