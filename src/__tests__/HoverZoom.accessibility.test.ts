/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import HoverZoom from '../HoverZoom';
import { setupTestContainer, cleanupTestContainer } from './test-utils';

describe('HoverZoom - Accessibility', () => {
  beforeEach(() => {
    setupTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  describe('ARIA Attributes', () => {
    test('should add ARIA attributes to image element', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      expect(image.getAttribute('role')).toBe('img');
      expect(image.getAttribute('aria-label')).toContain('Zoomable image');
      expect(image.getAttribute('tabindex')).toBe('0');
    });

    test('should add ARIA attributes to zoomed element for outside type', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;
      expect(zoomedElement.getAttribute('role')).toBe('region');
      expect(zoomedElement.getAttribute('aria-label')).toBe(
        'Zoomed image preview'
      );
      expect(zoomedElement.getAttribute('aria-live')).toBe('polite');
    });

    test('should add ARIA attributes to magnifier element for outside type', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;
      expect(magnifier.getAttribute('role')).toBe('tooltip');
      expect(magnifier.getAttribute('aria-label')).toBe(
        'Magnifying glass lens'
      );
      expect(magnifier.getAttribute('aria-hidden')).toBe('true');
    });

    test('should add ARIA attributes to magnifier element for inside type', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;
      expect(magnifier.getAttribute('role')).toBe('tooltip');
      expect(magnifier.getAttribute('aria-label')).toBe(
        'Magnifying glass lens'
      );
      expect(magnifier.getAttribute('aria-hidden')).toBe('true');
    });

    test('should add alt and role attributes to magnifier image for outside type', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      ) as HTMLImageElement;
      expect(magnifierImage.getAttribute('alt')).toBe('Magnified view');
      expect(magnifierImage.getAttribute('role')).toBe('presentation');
    });
  });

  describe('Screen Reader Support', () => {
    test('should have proper role attributes for screen reader navigation', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;
      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;

      expect(image.getAttribute('role')).toBe('img');
      expect(magnifier.getAttribute('role')).toBe('tooltip');
      expect(zoomedElement.getAttribute('role')).toBe('region');
    });

    test('should announce zoom state changes with aria-live', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;

      expect(zoomedElement.getAttribute('aria-live')).toBe('polite');
    });

    test('should have descriptive aria-labels for all interactive elements', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;
      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;

      expect(image.getAttribute('aria-label')).toContain('Zoomable image');
      expect(magnifier.getAttribute('aria-label')).toBe(
        'Magnifying glass lens'
      );
      expect(zoomedElement.getAttribute('aria-label')).toBe(
        'Zoomed image preview'
      );
    });

    test('should hide decorative elements from screen readers', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;
      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      ) as HTMLImageElement;

      expect(magnifier.getAttribute('aria-hidden')).toBe('true');
      expect(magnifierImage.getAttribute('role')).toBe('presentation');
    });

    test('should be keyboard accessible for screen reader users', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;

      expect(image.getAttribute('tabindex')).toBe('0');
    });

    test('should provide context for zoomed region', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;

      expect(zoomedElement.getAttribute('role')).toBe('region');
      expect(zoomedElement.getAttribute('aria-label')).toBe(
        'Zoomed image preview'
      );
    });

    test('should maintain proper document structure for screen readers', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const container = document.querySelector('.hoverzoom') as HTMLElement;
      const image = container.querySelector('.hoverzoom-image');
      const magnifier = container.querySelector('.hoverzoom-magnifier');
      const zoomedElement = container.querySelector('.hoverzoom-zoom');

      expect(image).toBeTruthy();
      expect(magnifier).toBeTruthy();
      expect(zoomedElement).toBeTruthy();

      expect(container.contains(image!)).toBe(true);
      expect(container.contains(magnifier!)).toBe(true);
      expect(container.contains(zoomedElement!)).toBe(true);
    });

    test('should work with inside type for screen readers', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const image = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;

      expect(image.getAttribute('role')).toBe('img');
      expect(image.getAttribute('aria-label')).toContain('Zoomable image');
      expect(magnifier.getAttribute('role')).toBe('tooltip');
      expect(magnifier.getAttribute('aria-label')).toBe(
        'Magnifying glass lens'
      );
    });

    test('should provide alt text for images used in magnifier', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      ) as HTMLImageElement;

      expect(magnifierImage.getAttribute('alt')).toBe('Magnified view');
    });
  });
});
