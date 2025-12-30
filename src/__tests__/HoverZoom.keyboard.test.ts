/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import HoverZoom from '../HoverZoom';
import { setupTestContainer, cleanupTestContainer } from './test-utils';

describe('HoverZoom - Keyboard Navigation', () => {
  beforeEach(() => {
    setupTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  test('should activate zoom when Enter key is pressed', (done) => {
    const hoverZoom = new HoverZoom({ type: 'outside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;
    const magnifier = document.querySelector(
      '.hoverzoom-magnifier'
    ) as HTMLElement;

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    image.dispatchEvent(enterEvent);

    requestAnimationFrame(() => {
      expect(magnifier.style.opacity).toBe('1');
      done();
    });
  });

  test('should activate zoom when Space key is pressed', (done) => {
    const hoverZoom = new HoverZoom({ type: 'outside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;
    const magnifier = document.querySelector(
      '.hoverzoom-magnifier'
    ) as HTMLElement;

    const spaceEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });

    image.dispatchEvent(spaceEvent);

    requestAnimationFrame(() => {
      expect(magnifier.style.opacity).toBe('1');
      done();
    });
  });

  test('should deactivate zoom when Escape key is pressed', (done) => {
    const hoverZoom = new HoverZoom({ type: 'outside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;
    const magnifier = document.querySelector(
      '.hoverzoom-magnifier'
    ) as HTMLElement;

    // First activate zoom
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    image.dispatchEvent(enterEvent);

    requestAnimationFrame(() => {
      // Then press Escape
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      image.dispatchEvent(escEvent);

      requestAnimationFrame(() => {
        expect(magnifier.style.opacity).toBe('0');
        done();
      });
    });
  });

  test('should toggle zoom on repeated Enter key presses', (done) => {
    const hoverZoom = new HoverZoom({ type: 'outside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;
    const magnifier = document.querySelector(
      '.hoverzoom-magnifier'
    ) as HTMLElement;

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    // First press - activate
    image.dispatchEvent(enterEvent);

    requestAnimationFrame(() => {
      expect(magnifier.style.opacity).toBe('1');

      // Second press - deactivate
      image.dispatchEvent(enterEvent);

      requestAnimationFrame(() => {
        expect(magnifier.style.opacity).toBe('0');
        done();
      });
    });
  });

  test('should show focus outline when image receives focus', () => {
    const hoverZoom = new HoverZoom({ type: 'outside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;

    const focusEvent = new FocusEvent('focus', {
      bubbles: true,
    });
    image.dispatchEvent(focusEvent);

    expect(image.style.outline).toBe('2px solid #4A90E2');
    expect(image.style.outlineOffset).toBe('2px');
  });

  test('should remove focus outline and deactivate zoom when image loses focus', (done) => {
    const hoverZoom = new HoverZoom({ type: 'outside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;
    const magnifier = document.querySelector(
      '.hoverzoom-magnifier'
    ) as HTMLElement;

    // Activate zoom first
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    image.dispatchEvent(enterEvent);

    requestAnimationFrame(() => {
      // Then blur
      const blurEvent = new FocusEvent('blur', {
        bubbles: true,
      });
      image.dispatchEvent(blurEvent);

      expect(image.style.outline).toBe('none');
      expect(magnifier.style.opacity).toBe('0');
      done();
    });
  });

  test('should work with inside type zoom on keyboard activation', (done) => {
    const hoverZoom = new HoverZoom({ type: 'inside' });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;
    const magnifier = document.querySelector(
      '.hoverzoom-magnifier'
    ) as HTMLElement;

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    image.dispatchEvent(enterEvent);

    requestAnimationFrame(() => {
      expect(magnifier.style.opacity).toBe('1');
      done();
    });
  });

  test('should apply filters when zoom is activated via keyboard', (done) => {
    const hoverZoom = new HoverZoom({
      type: 'outside',
      blur: true,
      grayscale: true,
    });
    hoverZoom.init();

    const image = document.querySelector(
      '.hoverzoom-image'
    ) as HTMLImageElement;

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    image.dispatchEvent(enterEvent);

    requestAnimationFrame(() => {
      expect(image.style.filter).toContain('blur');
      expect(image.style.filter).toContain('grayscale');
      done();
    });
  });
});
