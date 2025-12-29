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
    domCache: Map<string, HTMLElement>;
    rafId: number | null;
    private lastCall;
    imageCache: Map<string, HTMLImageElement>;
    private iteration;
    private currentContainer;
    private currentImageEl;
    private zoomedElement;
    private magnifierElement;
    private magnifierImageElement;
    constructor(options?: HoverZoomOptions);
    private throttle;
    private cacheElement;
    preloadImage(src: string): Promise<HTMLImageElement>;
    init(): void;
    private applyHoverZoom;
    private outsideZoom;
    private attachZoomedImage;
    private insideZoom;
    private addMouseListener;
    private addKeyboardListener;
    destroy(): void;
}
export default HoverZoom;
//# sourceMappingURL=HoverZoom.d.ts.map