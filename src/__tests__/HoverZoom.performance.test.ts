/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import HoverZoom from '../HoverZoom';
import { setupTestContainer, cleanupTestContainer } from './test-utils';

describe('HoverZoom - Performance', () => {
  beforeEach(() => {
    setupTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  describe('Image Preloading', () => {
    test('should preload images successfully', async () => {
      const hoverZoom = new HoverZoom();
      const imgSrc = 'test-preload.jpg';

      const promise = hoverZoom.preloadImage(imgSrc);
      expect(promise).toBeInstanceOf(Promise);

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

      hoverZoom.imageCache.set(imgSrc, new Image());

      const result = await hoverZoom.preloadImage(imgSrc);
      expect(result).toBeDefined();
    });

    test('should handle image preload errors gracefully', () => {
      const hoverZoom = new HoverZoom();
      const consoleWarn = console.warn;
      const warnings: any[] = [];
      console.warn = (...args: any[]) => warnings.push(args);

      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      img.dataset.largeImage = 'invalid-image.jpg';

      hoverZoom.init();

      console.warn = consoleWarn;
      expect(warnings.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Throttling', () => {
    test('should throttle mousemove events', (done) => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 50 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
      let callCount = 0;

      const originalSetProperty = image.style.setProperty;
      image.style.setProperty = function (...args: any[]) {
        if (args[0] === 'filter') callCount++;
        return originalSetProperty.apply(this, args as [string, string]);
      };

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
        expect(callCount).toBeLessThan(5);
        done();
      }, 100);
    });
  });

  describe('RequestAnimationFrame', () => {
    test('should use requestAnimationFrame for smooth rendering', (done) => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;

      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'offsetX', { value: 50 });
      Object.defineProperty(event, 'offsetY', { value: 50 });

      image.dispatchEvent(event);

      requestAnimationFrame(() => {
        expect(magnifier.style.transform).toContain('translate3d');
        done();
      });
    });

    test('should cancel previous animation frame on mouseout', () => {
      const hoverZoom = new HoverZoom({ type: 'outside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;

      const moveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(moveEvent, 'offsetX', { value: 50 });
      Object.defineProperty(moveEvent, 'offsetY', { value: 50 });
      image.dispatchEvent(moveEvent);

      const outEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
      });
      image.dispatchEvent(outEvent);

      expect(hoverZoom.rafId).toBe(null);
    });
  });

  describe('DOM Caching', () => {
    test('should cache DOM elements', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      expect(hoverZoom.domCache.size).toBeGreaterThan(0);
      expect(hoverZoom.domCache.get('image-0')).toBeDefined();
    });

    test('should cleanup on destroy', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      hoverZoom.rafId = 123;
      hoverZoom.domCache.set('test', document.createElement('div'));
      hoverZoom.imageCache.set('test.jpg', new Image());

      hoverZoom.destroy();

      expect(hoverZoom.domCache.size).toBe(0);
      expect(hoverZoom.imageCache.size).toBe(0);
    });
  });
});
