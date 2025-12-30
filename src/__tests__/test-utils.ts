/**
 * Test utilities and shared setup for HoverZoom tests
 */

export function setupTestContainer(): HTMLDivElement {
  document.body.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'hoverzoom';

  const img = document.createElement('img');
  img.className = 'hoverzoom-image';
  img.src = 'test-image.jpg';
  img.dataset.largeImage = 'test-image-large.jpg';
  img.style.width = '200px';
  img.style.height = '200px';

  container.appendChild(img);
  document.body.appendChild(container);

  return container;
}

export function cleanupTestContainer(): void {
  document.body.innerHTML = '';
}

export function createMouseEvent(
  type: string,
  offsetX: number,
  offsetY: number
): MouseEvent {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, 'offsetX', { value: offsetX });
  Object.defineProperty(event, 'offsetY', { value: offsetY });
  return event;
}

export function createKeyboardEvent(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
}

export function waitForAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}
