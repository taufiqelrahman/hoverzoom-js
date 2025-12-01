///////////////////////////////////
//
//  Type definitions for HoverZoom
//
///////////////////////////////////

declare interface HoverZoomClassNames {
  container: string;
  image: string;
  zoomedImage: string;
  magnifier: string;
  magnifierRound: string;
  magnifierImage: string;
}

declare interface HoverZoomOptions {
  classNames?: Partial<HoverZoomClassNames>;
  position?: "right" | "column" | string;
  type?: "outside" | "inside" | string;
  largeImage?: string;
  blur?: boolean;
  grayscale?: boolean;
  throttleDelay?: number;
}

declare class HoverZoom {
  constructor(options?: HoverZoomOptions);
  init(): void;
  destroy(): void;
  // Internal methods (not recommended for public use)
  private applyHoverZoom(): void;
  private outsideZoom(): void;
  private attachZoomedImage(): void;
  private insideZoom(): void;
  private addMouseListener(): void;
  private throttle(func: Function, delay: number): Function;
  private cacheElement(key: string, element: HTMLElement): HTMLElement;
  private preloadImage(src: string): Promise<HTMLImageElement>;
}

export default HoverZoom;
