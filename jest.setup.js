// Mock window properties that might not exist in jsdom
Object.defineProperty(window, "HTMLElement", {
  writable: true,
  value: function HTMLElement() {},
});

Object.defineProperty(window, "safari", {
  writable: true,
  value: undefined,
});

// Mock offsetWidth and offsetHeight
Object.defineProperties(HTMLElement.prototype, {
  offsetHeight: {
    get() {
      return parseFloat(this.style.height) || 100;
    },
  },
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || 100;
    },
  },
  offsetLeft: {
    get() {
      return parseFloat(this.style.left) || 0;
    },
  },
  offsetTop: {
    get() {
      return parseFloat(this.style.top) || 0;
    },
  },
});
