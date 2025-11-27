/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import HoverZoom from "../src/HoverZoom.js";

describe("HoverZoom", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    container.className = "hoverzoom";

    const img = document.createElement("img");
    img.className = "hoverzoom-image";
    img.src = "test-image.jpg";
    img.dataset.largeImage = "test-image-large.jpg";
    img.style.width = "200px";
    img.style.height = "200px";

    container.appendChild(img);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Constructor", () => {
    test("should create instance with default options", () => {
      const hoverZoom = new HoverZoom();

      expect(hoverZoom).toBeDefined();
      expect(hoverZoom.options).toBeDefined();
      expect(hoverZoom.options.position).toBe("right");
      expect(hoverZoom.options.type).toBe("outside");
      expect(hoverZoom.options.blur).toBe(false);
      expect(hoverZoom.options.grayscale).toBe(false);
    });

    test("should merge custom options with defaults", () => {
      const customOptions = {
        position: "bottom",
        type: "inside",
        blur: true,
        grayscale: true,
      };
      const hoverZoom = new HoverZoom(customOptions);

      expect(hoverZoom.options.position).toBe("bottom");
      expect(hoverZoom.options.type).toBe("inside");
      expect(hoverZoom.options.blur).toBe(true);
      expect(hoverZoom.options.grayscale).toBe(true);
    });

    test("should merge custom classNames with defaults", () => {
      const customOptions = {
        classNames: {
          container: "custom-container",
        },
      };
      const hoverZoom = new HoverZoom(customOptions);

      expect(hoverZoom.options.classNames.container).toBe("custom-container");
      expect(hoverZoom.options.classNames.image).toBe("hoverzoom-image");
    });

    test("should detect Safari browser", () => {
      const hoverZoom = new HoverZoom();
      expect(typeof hoverZoom.isSafari).toBe("boolean");
    });
  });

  describe("init()", () => {
    test("should initialize all hoverzoom containers", () => {
      const hoverZoom = new HoverZoom();
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      expect(image.id).toBe("hoverzoom-image-0");
    });

    test("should handle multiple containers", () => {
      const container2 = document.createElement("div");
      container2.className = "hoverzoom";
      const img2 = document.createElement("img");
      img2.className = "hoverzoom-image";
      img2.src = "test-image-2.jpg";
      img2.style.width = "200px";
      img2.style.height = "200px";
      container2.appendChild(img2);
      document.body.appendChild(container2);

      const hoverZoom = new HoverZoom();
      hoverZoom.init();

      const images = document.querySelectorAll(".hoverzoom-image");
      expect(images[0].id).toBe("hoverzoom-image-0");
      expect(images[1].id).toBe("hoverzoom-image-1");
    });

    test("should handle empty containers gracefully", () => {
      document.body.innerHTML = "";
      const hoverZoom = new HoverZoom();

      expect(() => hoverZoom.init()).not.toThrow();
    });
  });

  describe("outsideZoom()", () => {
    test("should create zoomed element for outside type", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const zoomedElement = document.querySelector(".hoverzoom-zoom");
      expect(zoomedElement).toBeTruthy();
      expect(zoomedElement.id).toBe("hoverzoom-zoom-0");
    });

    test("should create magnifier element", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const magnifier = document.querySelector(".hoverzoom-magnifier");
      expect(magnifier).toBeTruthy();
      expect(magnifier.id).toBe("hoverzoom-magnifier-0");
    });

    test("should create magnifier image element", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        ".hoverzoom-magnifier--image"
      );
      expect(magnifierImage).toBeTruthy();
      expect(magnifierImage.tagName).toBe("IMG");
    });

    test("should set correct background image", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const zoomedElement = document.querySelector(".hoverzoom-zoom");
      const bgImage = zoomedElement.style.backgroundImage;
      expect(bgImage).toContain("test-image-large.jpg");
    });

    test("should apply correct flex direction for right position", () => {
      const img = document.querySelector(".hoverzoom-image");
      img.dataset.position = "right";

      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const container = document.querySelector(".hoverzoom");
      expect(container.style.flexDirection).toBe("row");
    });

    test("should apply correct flex direction for bottom position", () => {
      const img = document.querySelector(".hoverzoom-image");
      img.dataset.position = "bottom";

      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const container = document.querySelector(".hoverzoom");
      expect(container.style.flexDirection).toBe("column");
    });
  });

  describe("insideZoom()", () => {
    test("should create magnifier for inside type", () => {
      const hoverZoom = new HoverZoom({ type: "inside" });
      hoverZoom.init();

      const magnifier = document.querySelector(".hoverzoom-magnifier");
      expect(magnifier).toBeTruthy();
      expect(magnifier.classList.contains("hoverzoom-magnifier--round")).toBe(
        true
      );
    });

    test("should create magnifier image div for inside type", () => {
      const hoverZoom = new HoverZoom({ type: "inside" });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        ".hoverzoom-magnifier--image"
      );
      expect(magnifierImage).toBeTruthy();
      expect(magnifierImage.tagName).toBe("DIV");
    });

    test("should set background image for inside magnifier", () => {
      const hoverZoom = new HoverZoom({ type: "inside" });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        ".hoverzoom-magnifier--image"
      );
      const bgImage = magnifierImage.style.backgroundImage;
      expect(bgImage).toContain("test-image-large.jpg");
    });
  });

  describe("Mouse Events", () => {
    test("should handle mousemove event", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100,
      });

      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      expect(() => image.dispatchEvent(event)).not.toThrow();
    });

    test("should apply opacity on mousemove", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const magnifier = document.querySelector(".hoverzoom-magnifier");

      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      image.dispatchEvent(event);

      expect(magnifier.style.opacity).toBe("1");
    });

    test("should apply blur filter when blur option is true", () => {
      const hoverZoom = new HoverZoom({ type: "outside", blur: true });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      image.dispatchEvent(event);

      expect(image.style.filter).toContain("blur");
    });

    test("should apply grayscale filter when grayscale option is true", () => {
      const hoverZoom = new HoverZoom({ type: "outside", grayscale: true });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      image.dispatchEvent(event);

      expect(image.style.filter).toContain("grayscale");
    });

    test("should handle mouseout event", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const magnifier = document.querySelector(".hoverzoom-magnifier");

      const mouseoutEvent = new MouseEvent("mouseout", {
        bubbles: true,
        cancelable: true,
      });

      image.dispatchEvent(mouseoutEvent);

      expect(magnifier.style.opacity).toBe("0");
      expect(image.style.filter).toBe("unset");
    });

    test("should respect data-blur attribute over options", () => {
      const img = document.querySelector(".hoverzoom-image");
      img.dataset.blur = "true";

      const hoverZoom = new HoverZoom({ type: "outside", blur: false });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      image.dispatchEvent(event);

      expect(image.style.filter).toContain("blur");
    });

    test("should respect data-grayscale attribute over options", () => {
      const img = document.querySelector(".hoverzoom-image");
      img.dataset.grayscale = "true";

      const hoverZoom = new HoverZoom({ type: "outside", grayscale: false });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      image.dispatchEvent(event);

      expect(image.style.filter).toContain("grayscale");
    });
  });

  describe("Data Attributes", () => {
    test("should use data-large-image if provided", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const zoomedElement = document.querySelector(".hoverzoom-zoom");
      expect(zoomedElement.style.backgroundImage).toContain(
        "test-image-large.jpg"
      );
    });

    test("should fallback to src if data-large-image not provided", () => {
      const img = document.querySelector(".hoverzoom-image");
      delete img.dataset.largeImage;

      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const zoomedElement = document.querySelector(".hoverzoom-zoom");
      expect(zoomedElement.style.backgroundImage).toContain("test-image.jpg");
    });

    test("should respect data-type attribute", () => {
      const img = document.querySelector(".hoverzoom-image");
      img.dataset.type = "inside";

      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const magnifier = document.querySelector(".hoverzoom-magnifier");
      expect(magnifier.classList.contains("hoverzoom-magnifier--round")).toBe(
        true
      );
    });
  });

  describe("Edge Cases", () => {
    test("should handle missing image element gracefully", () => {
      document.body.innerHTML = '<div class="hoverzoom"></div>';
      const hoverZoom = new HoverZoom();

      expect(() => hoverZoom.init()).toThrow();
    });

    test("should handle null magnifier element in mousemove", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const magnifier = document.querySelector(".hoverzoom-magnifier");
      magnifier.remove();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, "offsetX", { value: 50 });
      Object.defineProperty(event, "offsetY", { value: 50 });

      expect(() => image.dispatchEvent(event)).not.toThrow();
    });

    test("should handle events without offsetX/offsetY", () => {
      const hoverZoom = new HoverZoom({ type: "outside" });
      hoverZoom.init();

      const image = document.querySelector(".hoverzoom-image");
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
      });

      expect(() => image.dispatchEvent(event)).not.toThrow();
    });
  });
});
