interface HoverZoomClassNames {
    container: string;
    image: string;
    zoomedImage: string;
    magnifier: string;
    magnifierRound: string;
    magnifierImage: string;
}
interface HoverZoomOptions {
    classNames?: Partial<HoverZoomClassNames>;
    position?: 'right' | 'column' | string;
    type?: 'outside' | 'inside' | string;
    largeImage?: string;
    blur?: boolean;
    grayscale?: boolean;
    throttleDelay?: number;
}
declare class HoverZoom {
    options: Required<HoverZoomOptions>;
    private domCache;
    private rafId;
    private lastCall;
    private imageCache;
    private iteration;
    private currentContainer;
    private currentImageEl;
    private zoomedElement;
    private magnifierElement;
    private magnifierImageElement;
    constructor(options?: HoverZoomOptions);
    private throttle;
    private cacheElement;
    private preloadImage;
    init(): void;
    private applyHoverZoom;
    private outsideZoom;
    private attachZoomedImage;
    private insideZoom;
    private addMouseListener;
    destroy(): void;
}
export default HoverZoom;
//# sourceMappingURL=HoverZoom.d.ts.map