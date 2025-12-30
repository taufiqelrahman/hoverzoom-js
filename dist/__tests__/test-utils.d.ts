/**
 * Test utilities and shared setup for HoverZoom tests
 */
export declare function setupTestContainer(): HTMLDivElement;
export declare function cleanupTestContainer(): void;
export declare function createMouseEvent(type: string, offsetX: number, offsetY: number): MouseEvent;
export declare function createKeyboardEvent(key: string): KeyboardEvent;
export declare function waitForAnimationFrame(): Promise<void>;
//# sourceMappingURL=test-utils.d.ts.map