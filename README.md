# HoverZoom – Lightweight Non-JQuery Plugin

[![Build Status](https://img.shields.io/github/actions/workflow/status/taufiqelrahman/hoverzoom-js/deploy-vercel.yml?branch=master)](https://github.com/taufiqelrahman/hoverzoom-js/actions)
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
- 📘 **TypeScript Support** – Full type definitions included

---

## Browser Compatibility

Tested in:

- Chrome 139+
- Firefox 69+
- Safari 12+
- Opera 63+

---

## Getting Started

### 1. CDN / Script Tag

Include the stylesheet in your `<head>`:

```html
<link rel="stylesheet" href="hoverzoom.css" />
```

Include the script before closing `<body>`:

```html
<script src="hoverzoom.js"></script>
```

Add the required HTML structure:

```html
<div class="hoverzoom">
  <img
    class="hoverzoom-image"
    src="required.jpg"
    data-large-image="optional-large.jpg"
    data-blur="true"
    data-grayscale="true"
    data-type="outside"
    data-position="right"
  />
</div>
```

Initialize with default or custom options:

```html
<link rel="stylesheet" href="node_modules/hoverzoom-js/style.css" />
<script src="node_modules/hoverzoom-js/dist/hoverzoom.umd.min.js"></script>
<script>
  const hoverZoom = new HoverZoom({
    position: "right", // 'right' | 'bottom' (only for type: 'outside')
    type: "outside", // 'outside' | 'inside'
    blur: true, // apply blur filter
    grayscale: true, // apply grayscale filter
    throttleDelay: 16, // throttle delay in ms (default: 16ms/60fps)
  });
  hoverZoom.init();

  // Cleanup when done (optional)
  // hoverZoom.destroy();
</script>
```

---

### 2. Using HoverZoom with NPM / Module Bundlers

Install via package manager:

```bash
# pnpm (recommended)
pnpm add hoverzoom-js

# npm
npm install hoverzoom-js

# yarn
yarn add hoverzoom-js
```

Import and initialize in your JavaScript/TypeScript project:

```js
// ES Module

// import JS
import HoverZoom from "hoverzoom-js";
// import CSS
import "hoverzoom-js/style.css";

const hoverZoom = new HoverZoom({
  position: "right",
  type: "outside",
  blur: true,
  grayscale: true,
});

// Initialize all elements with 'hoverzoom' class
hoverZoom.init();

// Cleanup when component unmounts or not needed
// hoverZoom.destroy();

// CommonJS
const HoverZoom = require("hoverzoom-js");
require("hoverzoom-js/style.css");

const hoverZoom = new HoverZoom();
hoverZoom.init();
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

- Follow TypeScript best practices
- Write tests for new features
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
# Build for production
pnpm run build:all

# Verify package contents
pnpm run verify

# Deploy to npm (automated)
pnpm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 📄 License

MIT License

## 🐛 Bug Reports & Feature Requests

Submit via [GitHub Issues](https://github.com/taufiqelrahman/hoverzoom-js/issues).

⸻

Made with ❤️ for building a lightweight, high-performance image zoom plugin.
