/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import HoverZoom from '../HoverZoom';
import { setupTestContainer, cleanupTestContainer } from './test-utils';

describe('HoverZoom - Zoom Types', () => {
  beforeEach(() => {
    setupTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  describe('outsideZoom()', () => {
    test('should create zoomed element for outside type', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector('.hoverzoom-zoom');
      expect(zoomedElement).toBeTruthy();
      expect(zoomedElement!.id).toBe('hoverzoom-zoom-0');
    });

    test('should create magnifier element', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      expect(magnifier).toBeTruthy();
      expect(magnifier!.id).toBe('hoverzoom-magnifier-0');
    });

    test('should create magnifier image element', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      );
      expect(magnifierImage).toBeTruthy();
      expect(magnifierImage!.tagName).toBe('IMG');
    });

    test('should set correct background image', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const zoomedElement = document.querySelector(
        '.hoverzoom-zoom'
      ) as HTMLElement;
      const bgImage = zoomedElement.style.backgroundImage;
      expect(bgImage).toContain('test-image-large.jpg');
    });

    test('should apply correct flex direction for right position', () => {
      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      img.dataset.position = 'right';

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const container = document.querySelector('.hoverzoom') as HTMLElement;
      expect(container.style.flexDirection).toBe('row');
    });

    test('should apply correct flex direction for bottom position', () => {
      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      img.dataset.position = 'bottom';

      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const container = document.querySelector('.hoverzoom') as HTMLElement;
      expect(container.style.flexDirection).toBe('column');
    });
  });

  describe('insideZoom()', () => {
    test('should create magnifier for inside type', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const magnifier = document.querySelector('.hoverzoom-magnifier');
      expect(magnifier).toBeTruthy();
      expect(magnifier!.classList.contains('hoverzoom-magnifier--round')).toBe(
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
      expect(magnifierImage!.tagName).toBe('DIV');
    });

    test('should set background image for inside magnifier', () => {
      const hoverZoom = new HoverZoom({ type: 'inside' });
      hoverZoom.init();

      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      ) as HTMLElement;
      const bgImage = magnifierImage.style.backgroundImage;
      expect(bgImage).toContain('test-image-large.jpg');
    });
  });
});
