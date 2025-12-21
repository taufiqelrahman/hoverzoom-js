# HoverZoom – Lightweight Non-JQuery Plugin

[![Build Status](https://img.shields.io/github/actions/workflow/status/taufiqelrahman/hoverzoom-js/tests.yml?branch=master)](https://github.com/taufiqelrahman/hoverzoom-js/actions)
[![Good First Issue](https://img.shields.io/badge/good%20first%20issue-friendly-brightgreen)](https://github.com/taufiqelrahman/hoverzoom-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
![npm](https://img.shields.io/npm/v/hoverzoom-js)
![npm](https://img.shields.io/npm/dt/hoverzoom-js)
![license](https://img.shields.io/npm/l/hoverzoom-js)
[![Node Version](https://img.shields.io/badge/node-22.x-brightgreen)](https://nodejs.org/)

**HoverZoom** is a lightweight plugin built on **vanilla JavaScript** that allows users to zoom images on hover.  
No dependencies, no jQuery, fully optimized for minimal download size and fast performance.

[**Demo & Documentation**](https://hoverzoom-js.vercel.app)

---

## Features

- 🚀 **Lightweight** – Only 6.7kB minified (ESM) / 6.9kB (UMD)
- ⚡ **High Performance** – Throttled mousemove (60fps), requestAnimationFrame, GPU acceleration
- 📦 **Zero Dependencies** – Pure vanilla JavaScript, no jQuery or other libraries
- 🎯 **Easy Integration** – Works with CDN, npm, or any module bundler
- 🔍 **Flexible Zoom Modes** – Inside or outside lens positioning
- 🎨 **Visual Effects** – Optional blur and grayscale filters
- 💾 **Smart Caching** – DOM element and image caching for optimal performance
- 🖼️ **Lazy Loading** – Preloads large images only when needed
- 🧹 **Memory Safe** – Proper cleanup with `destroy()` method
- ✅ **Well Tested** – 95%+ unit test coverage, cross-browser e2e tests
- 📘 **TypeScript** – Written in TypeScript with full type definitions

---

## Browser Compatibility

Tested in:

- Chrome 139+
- Firefox 69+
- Safari 12+
- Opera 63+

---

## Quick Start

The fastest way to get started:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- CSS from CDN -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/hoverzoom-js@latest/dist/hoverzoom.min.css"
    />
  </head>
  <body>
    <!-- Your image -->
    <div class="hoverzoom">
      <img class="hoverzoom-image" src="your-image.jpg" alt="Zoom image" />
    </div>

    <!-- JS from CDN -->
    <script src="https://unpkg.com/hoverzoom-js@latest/dist/hoverzoom.umd.min.js"></script>
    <script>
      // Initialize
      const hoverZoom = new HoverZoom();
      hoverZoom.init();
    </script>
  </body>
</html>
```

---

## Installation

### 1. Via CDN (No Build Required)

Include the stylesheet in your `<head>`:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/hoverzoom-js@2.0.0/dist/hoverzoom.min.css"
/>
```

Include the script before closing `<body>`:

```html
<script src="https://unpkg.com/hoverzoom-js@2.0.0/dist/hoverzoom.umd.min.js"></script>
```

**HTML Structure:**

```html
<!-- Basic usage -->
<div class="hoverzoom">
  <img class="hoverzoom-image" src="image.jpg" alt="Zoom this image" />
</div>

<!-- With all options -->
<div class="hoverzoom">
  <img class="hoverzoom-image" src="thumbnail.jpg"
  data-large-image="full-size.jpg"
  <!-- Optional: use different image for zoom -->
  data-type="outside"
  <!-- 'outside' or 'inside' -->
  data-position="right"
  <!-- 'right' or 'bottom' (for outside type) -->
  data-blur="true"
  <!-- Optional: blur effect -->
  data-grayscale="true"
  <!-- Optional: grayscale effect -->
  alt="Product image" >
</div>
```

**Initialize:**

```html
<script>
  // Default options
  const hoverZoom = new HoverZoom();
  hoverZoom.init();

  // Or with custom options
  const hoverZoom = new HoverZoom({
    position: "right", // 'right' | 'bottom' (for outside type)
    type: "outside", // 'outside' | 'inside'
    blur: false, // apply blur filter on hover
    grayscale: false, // apply grayscale filter on hover
    throttleDelay: 16, // mousemove throttle (ms) - 16ms = ~60fps
  });
  hoverZoom.init();

  // Cleanup when done (e.g., SPA route change)
  // hoverZoom.destroy();
</script>
```

---

### 2. Via NPM / Package Manager

**Install:**

```bash
# pnpm (recommended)
pnpm add hoverzoom-js

# npm
npm install hoverzoom-js

# yarn
yarn add hoverzoom-js
```

**JavaScript/TypeScript Usage:**

```typescript
// ES Module (TypeScript or modern JS)
import HoverZoom from "hoverzoom-js";
import "hoverzoom-js/style.css";

const hoverZoom = new HoverZoom({
  position: "right",
  type: "outside",
  blur: false,
  grayscale: false,
});

// Initialize all elements with 'hoverzoom' class
hoverZoom.init();

// Cleanup when component unmounts (important for SPAs)
// hoverZoom.destroy();
```

**React Example:**

```tsx
import { useEffect } from "react";
import HoverZoom from "hoverzoom-js";
import "hoverzoom-js/style.css";

function ProductImage() {
  useEffect(() => {
    const hoverZoom = new HoverZoom();
    hoverZoom.init();

    // Cleanup on unmount
    return () => hoverZoom.destroy();
  }, []);

  return (
    <div className="hoverzoom">
      <img className="hoverzoom-image" src="product.jpg" alt="Product" />
    </div>
  );
}
```

**Vue Example:**

```vue
<template>
  <div class="hoverzoom">
    <img class="hoverzoom-image" src="product.jpg" alt="Product" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import HoverZoom from "hoverzoom-js";
import "hoverzoom-js/style.css";

let hoverZoom;

onMounted(() => {
  hoverZoom = new HoverZoom();
  hoverZoom.init();
});

onUnmounted(() => {
  hoverZoom?.destroy();
});
</script>
```

---

## Options

| Option        | Type    | Default   | Description                                           |
| ------------- | ------- | --------- | ----------------------------------------------------- |
| position      | string  | "right"   | Position of the zoomed image (right or bottom)        |
| type          | string  | "outside" | Magnifier type (inside or outside)                    |
| blur          | boolean | false     | Apply blur filter to the original image               |
| grayscale     | boolean | false     | Apply grayscale filter to the original image          |
| throttleDelay | number  | 16        | Mousemove throttle delay in ms (16ms = ~60fps)        |
| classNames    | object  | {...}     | Custom CSS class names for container, image, elements |

---

## HTML Structure

```html
<div class="hoverzoom">
  <img
    class="hoverzoom-image"
    src="small.jpg"
    data-large-image="large.jpg"
    data-type="outside"
    data-position="right"
    data-blur="true"
    data-grayscale="false"
  />
</div>
```

---

## Troubleshooting

**Zoom not working?**

- Ensure both CSS and JS files are loaded (check browser console)
- Verify HTML structure: parent with `hoverzoom` class, image with `hoverzoom-image` class
- Call `hoverZoom.init()` after adding elements dynamically
- For SPAs (React/Vue): Make sure to call `destroy()` on unmount to prevent memory leaks

**Image not loading?**

- Check `data-large-image` path is correct (relative to HTML file or absolute URL)
- Open browser DevTools Network tab to verify image loads successfully
- Ensure image CORS settings allow cross-origin loading if using external URLs

**TypeScript errors?**

- Make sure you're using v2.0.0 or later (includes TypeScript definitions)
- Import as: `import HoverZoom from "hoverzoom-js"`
- Check [src/HoverZoom.d.ts](src/HoverZoom.d.ts) for type definitions

---

## 🤝 Contributing

We ❤️ contributions!

- Check out good first issues here
- Fork the repo & create a branch:

```bash
git checkout -b feature/amazing-feature
```

- Commit & push your changes:

```bash
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

- Open a Pull Request to main.

### Guidelines

- Follow TypeScript best practices (source is in `src/HoverZoom.ts`)
- Write tests for new features (unit tests in Jest, e2e in Playwright)
- Run `pnpm run build` to compile TypeScript and test changes
- Ensure all tests pass: `pnpm run test:all`
- Follow existing code style and conventions
- Use conventional commit messages
- Keep code clean & formatted

⸻

## 📊 Performance

HoverZoom is optimized for maximum performance:

- **Throttled Events**: Mousemove events throttled to 60fps by default (configurable)
- **GPU Acceleration**: Uses `translate3d` for hardware-accelerated transforms
- **Smart Caching**: DOM elements and images cached to minimize queries
- **Lazy Loading**: Large images preloaded only when needed
- **Minimal Reflows**: Dimensions cached to avoid repeated layout calculations
- **RequestAnimationFrame**: Smooth animations synced with browser repaint cycle

## 🧪 Testing

```bash
# Unit tests (Jest)
pnpm test
pnpm run test:coverage  # With coverage report

# E2E tests (Playwright)
pnpm run test:e2e
pnpm run test:e2e:ui    # With UI mode

# All tests
pnpm run test:all
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 📦 Deployment

```bash
# Build for production (compiles TypeScript)
pnpm run build:all

# Verify package contents
pnpm run verify

# Deploy to npm (automated)
pnpm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 🛠️ Development

The project is written in **TypeScript** for better type safety and developer experience:

- **Source**: `src/HoverZoom.ts` (TypeScript)
- **Build**: Compiled to JavaScript via Rollup + TypeScript plugin
- **Output**: `dist/*.js` (ES Module & UMD formats)
- **Types**: Type definitions auto-generated during build

```bash
# Install dependencies
pnpm install

# Development workflow
pnpm run dev          # Build + start dev server
pnpm run build        # Compile TypeScript + build all
pnpm run test:watch   # Run tests in watch mode
```

See [BUILD_WORKFLOW.md](./BUILD_WORKFLOW.md) for detailed build documentation.

## 📄 License

MIT License

## 🐛 Bug Reports & Feature Requests

Submit via [GitHub Issues](https://github.com/taufiqelrahman/hoverzoom-js/issues).

⸻

Made with ❤️ for building a lightweight, high-performance image zoom plugin.
