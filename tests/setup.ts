/**
 * Test setup file for Vitest
 */

// Mock canvas if needed
if (typeof HTMLCanvasElement !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext.bind(
    HTMLCanvasElement.prototype
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLCanvasElement.prototype.getContext = function (contextId: string): any {
    if (contextId === '2d') {
      return {
        fillRect: (): void => {},
        clearRect: (): void => {},
        getImageData: (): unknown => ({ data: [] }),
        putImageData: (): void => {},
        createImageData: (): unknown => [],
        setTransform: (): void => {},
        drawImage: (): void => {},
        save: (): void => {},
        fillText: (): void => {},
        restore: (): void => {},
        beginPath: (): void => {},
        moveTo: (): void => {},
        lineTo: (): void => {},
        closePath: (): void => {},
        stroke: (): void => {},
        translate: (): void => {},
        scale: (): void => {},
        rotate: (): void => {},
        arc: (): void => {},
        fill: (): void => {},
        measureText: (): unknown => ({ width: 0 }),
        transform: (): void => {},
        rect: (): void => {},
        clip: (): void => {},
      };
    }
    return originalGetContext.call(this, contextId);
  };
}
