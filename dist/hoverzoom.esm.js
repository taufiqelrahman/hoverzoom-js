///////////////////////////////////
//
//  Name: HoverZoom
//  Version: 1.0.0
//  Author: Taufiq El Rahman
//
///////////////////////////////////
class HoverZoom {
    constructor(options = {}) {
        this.iteration = 0;
        const defaults = {
            classNames: {
                container: 'hoverzoom',
                image: 'hoverzoom-image',
                zoomedImage: 'hoverzoom-zoom',
                magnifier: 'hoverzoom-magnifier',
                magnifierRound: 'hoverzoom-magnifier--round',
                magnifierImage: 'hoverzoom-magnifier--image',
            },
            position: 'right',
            type: 'outside',
            largeImage: '',
            blur: false,
            grayscale: false,
            throttleDelay: 16,
        };
        this.options = {
            ...defaults,
            ...options,
            classNames: { ...defaults.classNames, ...(options.classNames || {}) },
        };
        // Cache for DOM references
        this.domCache = new Map();
        // Animation frame ID for smooth rendering
        this.rafId = null;
        // Throttle state
        this.lastCall = 0;
        // Lazy load state
        this.imageCache = new Map();
    }
    // Throttle function for mousemove optimization
    throttle(func, delay) {
        return (...args) => {
            const now = Date.now();
            if (now - this.lastCall >= delay) {
                this.lastCall = now;
                func.apply(this, args);
            }
        };
    }
    // Cache DOM element reference
    cacheElement(key, element) {
        if (!this.domCache.has(key)) {
            this.domCache.set(key, element);
        }
        return this.domCache.get(key);
    }
    // Preload image with lazy loading
    preloadImage(src) {
        if (this.imageCache.has(src)) {
            const cached = this.imageCache.get(src);
            if (cached)
                return Promise.resolve(cached);
        }
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    init() {
        const imgContainer = document.getElementsByClassName(this.options.classNames.container);
        for (let i = 0; i < imgContainer.length; i++) {
            this.iteration = i;
            this.currentContainer = imgContainer[i];
            this.applyHoverZoom();
        }
    }
    applyHoverZoom() {
        const { image } = this.options.classNames;
        const imageEl = this.currentContainer.querySelector(`.${image}`);
        if (!imageEl)
            return;
        this.currentImageEl = imageEl;
        this.currentImageEl.setAttribute('id', `${image}-${this.iteration}`);
        // Add ARIA attributes for accessibility
        this.currentImageEl.setAttribute('role', 'img');
        this.currentImageEl.setAttribute('aria-label', `Zoomable image ${this.iteration + 1}`);
        this.currentImageEl.setAttribute('tabindex', '0');
        // Cache current image element
        this.cacheElement(`image-${this.iteration}`, this.currentImageEl);
        this.options.largeImage = this.currentImageEl.dataset.largeImage
            ? this.currentImageEl.dataset.largeImage
            : this.currentImageEl.src;
        // Preload large image for better performance
        this.preloadImage(this.options.largeImage).catch(() => {
            console.warn('Failed to preload image:', this.options.largeImage);
        });
        const type = this.currentImageEl.dataset.type || this.options.type;
        if (type === 'outside') {
            this.outsideZoom();
        }
        else {
            this.insideZoom();
        }
        this.addMouseListener();
    }
    outsideZoom() {
        const { zoomedImage, magnifier, magnifierImage } = this.options.classNames;
        this.zoomedElement = document.createElement('DIV');
        this.zoomedElement.classList.add(zoomedImage);
        this.zoomedElement.setAttribute('id', `${zoomedImage}-${this.iteration}`);
        this.zoomedElement.setAttribute('role', 'region');
        this.zoomedElement.setAttribute('aria-label', 'Zoomed image preview');
        this.zoomedElement.setAttribute('aria-live', 'polite');
        this.zoomedElement.style.setProperty('background-image', `url('${this.options.largeImage}')`);
        // Cache image dimensions to avoid repeated reflows
        const imgWidth = this.currentImageEl.offsetWidth;
        const imgHeight = this.currentImageEl.offsetHeight;
        this.zoomedElement.style.setProperty('background-size', `${imgWidth * 4}px ${imgHeight * 4}px`);
        const position = this.currentImageEl.dataset.position || this.options.position;
        this.currentContainer.style.setProperty('flex-direction', position === 'right' ? 'row' : 'column');
        this.attachZoomedImage();
        this.magnifierElement = document.createElement('DIV');
        this.magnifierElement.classList.add(magnifier);
        this.magnifierElement.setAttribute('id', `${magnifier}-${this.iteration}`);
        this.magnifierElement.setAttribute('role', 'tooltip');
        this.magnifierElement.setAttribute('aria-label', 'Magnifying glass lens');
        this.magnifierElement.setAttribute('aria-hidden', 'true');
        this.magnifierImageElement = document.createElement('IMG');
        this.magnifierImageElement.classList.add(magnifierImage);
        this.magnifierImageElement.setAttribute('id', `${magnifierImage}-${this.iteration}`);
        this.magnifierImageElement.setAttribute('src', this.options.largeImage);
        this.magnifierImageElement.setAttribute('alt', 'Magnified view');
        this.magnifierImageElement.setAttribute('role', 'presentation');
        this.magnifierImageElement.style.setProperty('height', `${imgHeight}px`);
        this.magnifierImageElement.style.setProperty('width', `${imgWidth}px`);
        this.magnifierElement.appendChild(this.magnifierImageElement);
        this.currentContainer.appendChild(this.magnifierElement);
        // Cache DOM references
        this.cacheElement(`zoomed-${this.iteration}`, this.zoomedElement);
        this.cacheElement(`magnifier-${this.iteration}`, this.magnifierElement);
        this.cacheElement(`magnifier-image-${this.iteration}`, this.magnifierImageElement);
        const magnifierWidth = (this.magnifierElement.offsetHeight * imgWidth) / imgHeight;
        this.magnifierElement.style.setProperty('width', `${magnifierWidth}px`);
    }
    attachZoomedImage() {
        this.zoomedElement.style.setProperty('height', `${this.currentImageEl.offsetHeight}px`);
        this.zoomedElement.style.setProperty('width', `${this.currentImageEl.offsetWidth}px`);
        const position = this.currentImageEl.dataset.position || this.options.position;
        if (position === 'right') {
            this.zoomedElement.style.setProperty('margin-left', '6px');
        }
        else {
            this.zoomedElement.style.setProperty('margin-top', '6px');
        }
        this.currentContainer.appendChild(this.zoomedElement);
    }
    insideZoom() {
        const { magnifier, magnifierImage, magnifierRound } = this.options.classNames;
        this.magnifierElement = document.createElement('DIV');
        this.magnifierElement.classList.add(magnifier);
        this.magnifierElement.classList.add(magnifierRound);
        this.magnifierElement.setAttribute('id', `${magnifier}-${this.iteration}`);
        this.magnifierElement.setAttribute('role', 'tooltip');
        this.magnifierElement.setAttribute('aria-label', 'Magnifying glass lens');
        this.magnifierElement.setAttribute('aria-hidden', 'true');
        this.magnifierImageElement = document.createElement('DIV');
        this.magnifierImageElement.classList.add(magnifierImage);
        this.magnifierImageElement.setAttribute('id', `${magnifierImage}-${this.iteration}`);
        this.magnifierImageElement.style.setProperty('background-image', `url('${this.options.largeImage}')`);
        // Cache image dimensions to avoid repeated reflows
        const imgWidth = this.currentImageEl.offsetWidth;
        const imgHeight = this.currentImageEl.offsetHeight;
        this.magnifierImageElement.style.setProperty('background-size', `${imgWidth * 4}px ${imgHeight * 4}px`);
        this.magnifierImageElement.style.setProperty('height', `${imgHeight}px`);
        this.magnifierImageElement.style.setProperty('width', `${imgWidth}px`);
        this.magnifierElement.appendChild(this.magnifierImageElement);
        this.currentContainer.appendChild(this.magnifierElement);
        // Cache DOM references
        this.cacheElement(`magnifier-${this.iteration}`, this.magnifierElement);
        this.cacheElement(`magnifier-image-${this.iteration}`, this.magnifierImageElement);
    }
    addMouseListener() {
        const { image, magnifier, magnifierImage, zoomedImage } = this.options.classNames;
        // Use cached DOM references
        const magnifierElement = this.domCache.get(`magnifier-${this.iteration}`) ||
            document.getElementById(`${magnifier}-${this.iteration}`);
        const zoomedElement = this.domCache.get(`zoomed-${this.iteration}`) ||
            document.getElementById(`${zoomedImage}-${this.iteration}`);
        const currentImageEl = this.domCache.get(`image-${this.iteration}`) ||
            document.getElementById(`${image}-${this.iteration}`);
        const magnifierImageElement = this.domCache.get(`magnifier-image-${this.iteration}`) ||
            document.getElementById(`${magnifierImage}-${this.iteration}`);
        if (!magnifierElement || !currentImageEl)
            return;
        // Cache dimensions to avoid repeated reflows
        const { offsetHeight, offsetWidth } = magnifierElement;
        const type = currentImageEl.dataset.type || this.options.type;
        // Pre-calculate constants
        const bgPosXMultiplier = 3;
        const bgPosYMultiplier = 3;
        const magnifierTransformX = offsetWidth * 0.5;
        const magnifierTransformY = type === 'outside' ? offsetHeight * -0.52 : -(offsetHeight * 0.51);
        const magnifierOffsetX = offsetWidth / 2 - 1;
        const magnifierOffsetY = offsetHeight / 2;
        // Build filter string once
        let filter = 'opacity(0.8)';
        if (currentImageEl.dataset.blur || this.options.blur)
            filter += ' blur(2px)';
        if (currentImageEl.dataset.grayscale || this.options.grayscale)
            filter += ' grayscale(100%)';
        // Throttled mousemove handler with requestAnimationFrame
        const handleMouseMove = this.throttle((event) => {
            // Cancel previous animation frame if exists
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            // Use requestAnimationFrame for smooth rendering
            this.rafId = requestAnimationFrame(() => {
                if (!currentImageEl || !magnifierElement)
                    return;
                // Apply filter on first move
                currentImageEl.style.setProperty('filter', filter);
                magnifierElement.style.setProperty('opacity', '1');
                if (type === 'outside' && zoomedElement)
                    zoomedElement.style.setProperty('opacity', '1');
                const posX = event.offsetX
                    ? event.offsetX
                    : event.pageX - currentImageEl.offsetLeft;
                const posY = event.offsetY
                    ? event.offsetY
                    : event.pageY - currentImageEl.offsetTop;
                // Update background positions
                if (type === 'outside' && zoomedElement) {
                    zoomedElement.style.setProperty('background-position', `${-posX * bgPosXMultiplier}px ${-posY * bgPosYMultiplier}px`);
                }
                if (type !== 'outside' && magnifierImageElement) {
                    magnifierImageElement.style.setProperty('background-position', `${-posX * bgPosXMultiplier}px ${-posY * bgPosYMultiplier}px`);
                }
                // Update transforms using translate3d for GPU acceleration
                magnifierElement.style.setProperty('transform', `translate3d(${event.offsetX - magnifierTransformX}px, ${event.offsetY + magnifierTransformY}px, 0)`);
                if (magnifierImageElement) {
                    magnifierImageElement.style.setProperty('transform', `translate3d(${-event.offsetX + magnifierOffsetX}px, ${-event.offsetY + magnifierOffsetY}px, 0)`);
                }
            });
        }, this.options.throttleDelay);
        this.currentImageEl.addEventListener('mousemove', handleMouseMove);
        this.currentImageEl.addEventListener('mouseout', () => {
            // Cancel any pending animation frame
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
            if (!currentImageEl || !magnifierElement)
                return;
            currentImageEl.style.setProperty('filter', 'unset');
            magnifierElement.style.setProperty('opacity', '0');
            if (type === 'outside' && zoomedElement)
                zoomedElement.style.setProperty('opacity', '0');
        });
    }
    // Clean up method for proper memory management
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.domCache.clear();
        this.imageCache.clear();
    }
}

export { HoverZoom as default };
