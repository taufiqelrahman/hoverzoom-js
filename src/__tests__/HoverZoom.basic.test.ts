/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import HoverZoom from '../HoverZoom';
import { setupTestContainer, cleanupTestContainer } from './test-utils';

describe('HoverZoom - Basic Functionality', () => {
  beforeEach(() => {
    setupTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer();
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
        position: 'bottom' as const,
        type: 'inside' as const,
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

      const image = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
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

  describe('Data Attributes', () => {
    test('should use data-large-image if provided', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;
      expect(zoomedElement.style.backgroundImage).toContain(
        'test-image-large.jpg'
      );
    });

    test('should fallback to src if data-large-image not provided', () => {
      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      delete img.dataset.largeImage;

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;
      expect(zoomedElement.style.backgroundImage).toContain('test-image.jpg');
    });

    test('should respect data-type attribute', () => {
      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      img.dataset.type = 'inside';

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      expect(magnifier!.classList.contains('hoverzoom-magnifier--round')).toBe(
        true
      );
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing image element gracefully', () => {
      document.body.innerHTML = '<div class="hoverzoom"></div>';
      const hoverZoom = new HoverZoom();

      expect(() => hoverZoom.init()).not.toThrow();
    });

    test('should handle null magnifier element in mousemove', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      magnifier!.remove();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
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

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      });

      expect(() => image.dispatchEvent(event)).not.toThrow();
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
