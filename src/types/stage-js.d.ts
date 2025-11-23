/**
 * Type declarations for stage-js library
 */

declare module 'stage-js' {
  interface PinOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    scale?: number;
    rotation?: number;
    alpha?: number;
    align?: number;
    alignX?: number;
    alignY?: number;
    handle?: number;
    handleX?: number;
    handleY?: number;
    offsetX?: number;
    offsetY?: number;
    pivotX?: number;
    pivotY?: number;
    skewX?: number;
    skewY?: number;
  }

  interface StageOptions {
    width?: number;
    height?: number;
    scaleMode?: 'in' | 'out' | 'fit' | 'in-pad' | 'out-crop';
    align?: number;
    alignX?: number;
    alignY?: number;
    resolution?: number;
    pixelRatio?: number;
  }

  interface StageNode {
    pin(options: PinOptions): this;
    image(src: string | HTMLImageElement | HTMLCanvasElement): this;
    append(...nodes: StageNode[]): this;
    prepend(...nodes: StageNode[]): this;
    remove(): this;
    empty(): this;
    background(color: string): this;
    tick(callback: (elapsed: number) => void, once?: boolean): this;
    on(event: string, callback: (...args: unknown[]) => void): this;
    off(event: string, callback: (...args: unknown[]) => void): this;
    
    attr(name: string, value?: unknown): unknown;
    label(text: string): this;
    
    width(): number;
    width(value: number): this;
    height(): number;
    height(value: number): this;
    
    visit(visitor: (node: StageNode) => void): void;
  }

  interface Stage extends StageNode {
    mount(element: HTMLElement, options?: StageOptions): Stage;
  }

  interface StageStatic {
    mount(element: HTMLElement, options?: StageOptions): Stage;
    create(): StageNode;
    string(text: string): string;
    
    image(image: HTMLImageElement | HTMLCanvasElement): StageNode;
    
    texture(src: string | HTMLImageElement | HTMLCanvasElement): unknown;
  }

  const Stage: StageStatic;
  export default Stage;
}
