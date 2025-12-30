/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import HoverZoom from '../HoverZoom';
import { setupTestContainer, cleanupTestContainer } from './test-utils';

describe('HoverZoom - Mouse Events', () => {
  beforeEach(() => {
    setupTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  describe('Mouse Events for Outside Type', () => {
    test('should handle mousemove event', () => {
      const hoverZoom = new HoverZoom({ type: 'outside' });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
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

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
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

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
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

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
      const magnifier = document.querySelector(
        '.hoverzoom-magnifier'
      ) as HTMLElement;

      const mouseoutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
      });

      image.dispatchEvent(mouseoutEvent);

      expect(magnifier.style.opacity).toBe('0');
      expect(image.style.filter).toBe('unset');
    });

    test('should respect data-blur attribute over options', (done) => {
      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      img.dataset.blur = 'true';

      const hoverZoom = new HoverZoom({
        type: 'outside',
        blur: false,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
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
      const img = document.querySelector(
        '.hoverzoom-image'
      ) as HTMLImageElement;
      img.dataset.grayscale = 'true';

      const hoverZoom = new HoverZoom({
        type: 'outside',
        grayscale: false,
        throttleDelay: 0,
      });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
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

  describe('Mouse Events for Inside Type', () => {
    test('should handle mousemove for inside type', (done) => {
      const hoverZoom = new HoverZoom({ type: 'inside', throttleDelay: 0 });
      hoverZoom.init();

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;
      const magnifierImage = document.querySelector(
        '.hoverzoom-magnifier--image'
      ) as HTMLElement;

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

      const image = document.querySelector('.hoverzoom-image') as HTMLElement;

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
});
