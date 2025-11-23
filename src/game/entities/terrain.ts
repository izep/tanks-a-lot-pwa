/**
 * Terrain generation and manipulation
 */

import { Vector2D } from '@/types/game';
import { SeededRandom, clamp } from '@/utils/math';

export class Terrain {
  private heightMap: number[];
  private bitmap: Uint8Array;
  private width: number;
  private height: number;

  constructor(width: number, height: number, seed?: number, roughness = 0.5) {
    this.width = width;
    this.height = height;
    this.heightMap = this.generateHeightMap(width, seed, roughness);
    this.bitmap = this.createBitmap();
  }

  /**
   * Generate terrain height map using midpoint displacement
   */
  private generateHeightMap(width: number, seed?: number, roughness = 0.5): number[] {
    const rng = seed !== undefined ? new SeededRandom(seed) : null;
    const random = rng
      ? (min: number, max: number): number => rng.range(min, max)
      : (min: number, max: number): number => Math.random() * (max - min) + min;

    const heights = new Array(width).fill(0);

    // Set initial endpoints
    heights[0] = random(0.3, 0.7);
    heights[width - 1] = random(0.3, 0.7);

    // Midpoint displacement algorithm
    const displace = (start: number, end: number, roughness: number): void => {
      if (end - start <= 1) return;

      const mid = Math.floor((start + end) / 2);
      const range = (heights[end] - heights[start]) * roughness;

      const midValue = (heights[start] + heights[end]) / 2 + random(-range, range);
      heights[mid] = clamp(midValue, 0, 1);

      displace(start, mid, roughness * 0.5);
      displace(mid, end, roughness * 0.5);
    };

    displace(0, width - 1, roughness);

    return heights;
  }

  /**
   * Create bitmap from height map
   */
  private createBitmap(): Uint8Array {
    const bitmap = new Uint8Array(this.width * this.height);

    for (let x = 0; x < this.width; x++) {
      const terrainHeight = Math.floor(this.heightMap[x] * this.height);

      // Fill column from bottom up to terrain height
      for (let y = this.height - 1; y >= this.height - terrainHeight; y--) {
        bitmap[y * this.width + x] = 1;
      }
    }

    return bitmap;
  }

  /**
   * Get terrain height at x coordinate
   */
  getHeightAt(x: number): number {
    const ix = Math.floor(x);
    if (ix < 0 || ix >= this.width) return 0;

    // Find topmost solid pixel in column
    for (let y = 0; y < this.height; y++) {
      if (this.bitmap[y * this.width + ix] === 1) {
        return y;
      }
    }

    return this.height;
  }

  /**
   * Check if a pixel is solid terrain
   */
  isSolid(x: number, y: number): boolean {
    const ix = Math.floor(x);
    const iy = Math.floor(y);

    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) {
      return false;
    }

    return this.bitmap[iy * this.width + ix] === 1;
  }

  /**
   * Create circular explosion crater
   */
  explode(center: Vector2D, radius: number): void {
    const radiusSq = radius * radius;
    const minX = Math.max(0, Math.floor(center.x - radius));
    const maxX = Math.min(this.width - 1, Math.ceil(center.x + radius));
    const minY = Math.max(0, Math.floor(center.y - radius));
    const maxY = Math.min(this.height - 1, Math.ceil(center.y + radius));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dx = x - center.x;
        const dy = y - center.y;
        const distSq = dx * dx + dy * dy;

        if (distSq <= radiusSq) {
          this.bitmap[y * this.width + x] = 0;
        }
      }
    }

    // Apply gravity to make unsupported pixels fall
    this.applyGravity();
  }

  /**
   * Add dirt at a location (for dirt bombs)
   */
  addDirt(center: Vector2D, radius: number): void {
    const radiusSq = radius * radius;
    const minX = Math.max(0, Math.floor(center.x - radius));
    const maxX = Math.min(this.width - 1, Math.ceil(center.x + radius));
    const minY = Math.max(0, Math.floor(center.y - radius));
    const maxY = Math.min(this.height - 1, Math.ceil(center.y + radius));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dx = x - center.x;
        const dy = y - center.y;
        const distSq = dx * dx + dy * dy;

        if (distSq <= radiusSq) {
          this.bitmap[y * this.width + x] = 1;
        }
      }
    }
  }

  /**
   * Apply gravity - make unsupported pixels fall
   */
  private applyGravity(): void {
    // Scan from bottom to top
    for (let y = this.height - 2; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        const index = y * this.width + x;

        if (this.bitmap[index] === 1) {
          // Check if pixel below is empty
          let fallDistance = 0;
          let checkY = y + 1;

          while (checkY < this.height && this.bitmap[checkY * this.width + x] === 0) {
            fallDistance++;
            checkY++;
          }

          if (fallDistance > 0) {
            // Move pixel down
            this.bitmap[index] = 0;
            this.bitmap[(y + fallDistance) * this.width + x] = 1;
          }
        }
      }
    }
  }

  /**
   * Get bitmap data for rendering
   */
  getBitmap(): Uint8Array {
    return this.bitmap;
  }

  /**
   * Get terrain dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}
