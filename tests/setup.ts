/**
 * Test setup file for Vitest
 */

// Mock canvas if needed
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (): unknown {
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
  };
}
