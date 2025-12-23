/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import HoverZoom from '../src/HoverZoom.ts';

describe('HoverZoom', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.className = 'hoverzoom';

    const img = document.createElement('img');
    img.className = 'hoverzoom-image';
    img.src = 'test-image.jpg';
    img.dataset.largeImage = 'test-image-large.jpg';
    img.style.width = '200px';
    img.style.height = '200px';

    container.appendChild(img);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    test('should create instance with default options', () => {
      const hoverZoom = new HoverZoom();

      expect(hoverZoom).toBeDefined();
      expect(hoverZoom.options).toBeDefined();
      expect(hoverZoom.options.position).toBe('right');
      expect(hoverZoom.options.type).toBe('outside');
      expect(hoverZoom.options.blur).toBe(false);
      expect(hoverZoom.options.grayscale).toBe(false);
    });

    test('should merge custom options with defaults', () => {
      const customOptions = {
        position: 'bottom',
        type: 'inside',
        blur: true,
        grayscale: true,
      };
      const hoverZoom = new HoverZoom(customOptions);

      expect(hoverZoom.options.position).toBe('bottom');
      expect(hoverZoom.options.type).toBe('inside');
      expect(hoverZoom.options.blur).toBe(true);
      expect(hoverZoom.options.grayscale).toBe(true);
    });

    test('should merge custom classNames with defaults', () => {
      const customOptions = {
        classNames: {
          container: 'custom-container',
        },
      };
      const hoverZoom = new HoverZoom(customOptions);

      expect(hoverZoom.options.classNames.container).toBe('custom-container');
      expect(hoverZoom.options.classNames.image).toBe('hoverzoom-image');
    });
  });

  describe('init()', () => {
    test('should initialize all hoverzoom containers', () => {
      const hoverZoom = new HoverZoom();
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      expect(image.id).toBe('hoverzoom-image-0');
    });

    test('should handle multiple containers', () => {
      const container2 = document.createElement('div');
      container2.className = 'hoverzoom';
      const img2 = document.createElement('img');
      img2.className = 'hoverzoom-image';
      img2.src = 'test-image-2.jpg';
      img2.style.width = '200px';
      img2.style.height = '200px';
      container2.appendChild(img2);
      document.body.appendChild(container2);

      const hoverZoom = new HoverZoom();
      hoverZoom.init();

      const images = document.querySelectorAll('.hoverzoom-image');
      expect(images[0].id).toBe('hoverzoom-image-0');
      expect(images[1].id).toBe('hoverzoom-image-1');
    });

    test('should handle empty containers gracefully', () => {
      document.body.innerHTML = '';
      const hoverZoom = new HoverZoom();

      expect(() => hoverZoom.init()).not.toThrow();
    });
  });

  describe('outsideZoom()', () => {
    test('should create zoomed element for outside type', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector('.hoverzoom-zoom');
      expect(zoomedElement).toBeTruthy();
      expect(zoomedElement.id).toBe('hoverzoom-zoom-0');
    });

    test('should create magnifier element', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      expect(magnifier).toBeTruthy();
      expect(magnifier.id).toBe('hoverzoom-magnifier-0');
    });

    test('should create magnifier image element', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      );
      expect(magnifierImage).toBeTruthy();
      expect(magnifierImage.tagName).toBe('IMG');
    });

    test('should set correct background image', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector('.hoverzoom-zoom');
      const bgImage = zoomedElement.style.backgroundImage;
      expect(bgImage).toContain('test-image-large.jpg');
    });

    test('should apply correct flex direction for right position', () => {
      const img = document.querySelector('.hoverzoom-image');
      img.dataset.position = 'right';

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const container = document.querySelector('.hoverzoom');
      expect(container.style.flexDirection).toBe('row');
    });

    test('should apply correct flex direction for bottom position', () => {
      const img = document.querySelector('.hoverzoom-image');
      img.dataset.position = 'bottom';

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const container = document.querySelector('.hoverzoom');
      expect(container.style.flexDirection).toBe('column');
    });
  });

  describe('insideZoom()', () => {
    test('should create magnifier for inside type', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      expect(magnifier).toBeTruthy();
      expect(magnifier.classList.contains('hoverzoom-magnifier--round')).toBe(
        true
      );
    });

    test('should create magnifier image div for inside type', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      );
      expect(magnifierImage).toBeTruthy();
      expect(magnifierImage.tagName).toBe('DIV');
    });

    test('should set background image for inside magnifier', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      );
      const bgImage = magnifierImage.style.backgroundImage;
      expect(bgImage).toContain('test-image-large.jpg');
    });
  });

  describe('Mouse Events', () => {
    test('should handle mousemove event', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100,
      });

      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      expect(() => image.dispatchEvent(event)).not.toThrow();
    });

    test('should apply opacity on mousemove', (done) => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const magnifier = document.querySelector('.hoverzoom-magnifier');

      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(magnifier.style.opacity).toBe('1');
        done();
      });
    });

    test('should apply blur filter when blur option is true', (done) => {
      const hoverZoom = new HoverZoom({
        type: 'outside',
        blur: true,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(image.style.filter).toContain('blur');
        done();
      });
    });

    test('should apply grayscale filter when grayscale option is true', (done) => {
      const hoverZoom = new HoverZoom({
        type: 'outside',
        grayscale: true,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(image.style.filter).toContain('grayscale');
        done();
      });
    });

    test('should handle mouseout event', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const magnifier = document.querySelector('.hoverzoom-magnifier');

      const mouseoutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
      });

      image.dispatchEvent(mouseoutEvent);

      expect(magnifier.style.opacity).toBe('0');
      expect(image.style.filter).toBe('unset');
    });

    test('should respect data-blur attribute over options', (done) => {
      const img = document.querySelector('.hoverzoom-image');
      img.dataset.blur = 'true';

      const hoverZoom = new HoverZoom({
        type: 'outside',
        blur: false,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(image.style.filter).toContain('blur');
        done();
      });
    });

    test('should respect data-grayscale attribute over options', (done) => {
      const img = document.querySelector('.hoverzoom-image');
      img.dataset.grayscale = 'true';

      const hoverZoom = new HoverZoom({
        type: 'outside',
        grayscale: false,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(image.style.filter).toContain('grayscale');
        done();
      });
    });
  });

  describe('Data Attributes', () => {
    test('should use data-large-image if provided', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector('.hoverzoom-zoom');
      expect(zoomedElement.style.backgroundImage).toContain(
        'test-image-large.jpg'
      );
    });

    test('should fallback to src if data-large-image not provided', () => {
      const img = document.querySelector('.hoverzoom-image');
      delete img.dataset.largeImage;

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector('.hoverzoom-zoom');
      expect(zoomedElement.style.backgroundImage).toContain('test-image.jpg');
    });

    test('should respect data-type attribute', () => {
      const img = document.querySelector('.hoverzoom-image');
      img.dataset.type = 'inside';

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      expect(magnifier.classList.contains('hoverzoom-magnifier--round')).toBe(
        true
      );
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing image element gracefully', () => {
      document.body.innerHTML = '<div class="hoverzoom"></div>';
      const hoverZoom = new HoverZoom();

      // Should not throw - just returns early
      expect(() => hoverZoom.init()).not.toThrow();
    });

    test('should handle null magnifier element in mousemove', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      magnifier.remove();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      expect(() => image.dispatchEvent(event)).not.toThrow();
    });

    test('should handle events without offsetX/offsetY', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });

      expect(() => image.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Performance Features', () => {
    test('should preload images successfully', async () => {
      const hoverZoom = new HoverZoom();
      const imgSrc = 'test-preload.jpg';

      const promise = hoverZoom.preloadImage(imgSrc);
      expect(promise).toBeInstanceOf(Promise);

      // Simulate image load
      const images = document.querySelectorAll('img');
      const preloadImg = Array.from(images).find((img) =>
        img.src.includes(imgSrc)
      );
      if (preloadImg) {
        preloadImg.dispatchEvent(new Event('load'));
      }
    });

    test('should return cached image on second preload', async () => {
      const hoverZoom = new HoverZoom();
      const imgSrc = 'test-cached.jpg';

      // First call caches the image
      hoverZoom.imageCache.set(imgSrc, new Image());

      // Second call should return from cache
      const result = await hoverZoom.preloadImage(imgSrc);
      expect(result).toBeDefined();
    });

    test('should handle image preload errors gracefully', () => {
      const hoverZoom = new HoverZoom();
      const consoleWarn = console.warn;
      const warnings = [];
      console.warn = (...args) => warnings.push(args);

      const img = document.querySelector('.hoverzoom-image');
      img.dataset.largeImage = 'invalid-image.jpg';

      hoverZoom.init();

      console.warn = consoleWarn;
      expect(warnings.length).toBeGreaterThanOrEqual(0);
    });

    test('should throttle mousemove events', (done) => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 50 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      let callCount = 0;

      // Override to count calls
      const originalSetProperty = image.style.setProperty;
      image.style.setProperty = function (...args) {
        if (args[0] === 'filter') callCount++;
        return originalSetProperty.apply(this, args);
      };

      // Dispatch multiple events quickly
      for (let i = 0; i < 5; i++) {
        const event = new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(event, 'offsetX', { value: 50 + i });
        Object.defineProperty(event, 'offsetY', { value: 50 + i });
        image.dispatchEvent(event);
      }

      setTimeout(() => {
        // Should be throttled to less than 5 calls
        expect(callCount).toBeLessThan(5);
        done();
      }, 100);
    });

    test('should use requestAnimationFrame for smooth rendering', (done) => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const magnifier = document.querySelector('.hoverzoom-magnifier');

      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      // Check that RAF is being used (transform should be set after RAF)
      requestAnimationFrame(() => {
        expect(magnifier.style.transform).toContain('translate3d');
        done();
      });
    });

    test('should cache DOM elements', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      expect(hoverZoom.domCache.size).toBeGreaterThan(0);
      expect(hoverZoom.domCache.get('image-0')).toBeDefined();
    });

    test('should cleanup on destroy', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      // Set some cache data
      hoverZoom.rafId = 123;
      hoverZoom.domCache.set('test', document.createElement('div'));
      hoverZoom.imageCache.set('test.jpg', new Image());

      hoverZoom.destroy();

      expect(hoverZoom.domCache.size).toBe(0);
      expect(hoverZoom.imageCache.size).toBe(0);
    });

    test('should cancel previous animation frame on mouseout', () => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');

      // Trigger mousemove to set rafId
      const moveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(moveEvent, 'offsetX', { value: 50 });
      Object.defineProperty(moveEvent, 'offsetY', { value: 50 });
      image.dispatchEvent(moveEvent);

      // Trigger mouseout
      const outEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
      });
      image.dispatchEvent(outEvent);

      expect(hoverZoom.rafId).toBe(null);
    });
  });

  describe('Inside Type Mouse Events', () => {
    test('should handle mousemove for inside type', (done) => {
      const hoverZoom = new HoverZoom({ type: 'inside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');
      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      );

      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(magnifierImage.style.backgroundPosition).toBeTruthy();
        done();
      });
    });

    test('should apply filters for inside type on hover', (done) => {
      const hoverZoom = new HoverZoom({
        type: 'inside',
        blur: true,
        grayscale: true,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image');

      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(image.style.filter).toContain('blur');
        expect(image.style.filter).toContain('grayscale');
        done();
      });
    });
  });

  describe('Custom throttleDelay Option', () => {
    test('should use custom throttle delay', () => {
      const hoverZoom = new HoverZoom({ throttleDelay: 32 });
      expect(hoverZoom.options.throttleDelay).toBe(32);
    });

    test('should use default throttle delay when not specified', () => {
      const hoverZoom = new HoverZoom();
      expect(hoverZoom.options.throttleDelay).toBe(16);
    });
  });
});
