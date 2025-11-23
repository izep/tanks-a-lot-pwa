/**
 * Tests for terrain generation and manipulation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Terrain } from '@/game/entities/terrain';

describe('Terrain', () => {
  let terrain: Terrain;

  beforeEach(() => {
    terrain = new Terrain(800, 600, 12345, 0.5);
  });

  describe('constructor', () => {
    it('should create terrain with correct dimensions', () => {
      const { width, height } = terrain.getDimensions();
      expect(width).toBe(800);
      expect(height).toBe(600);
    });

    it('should create deterministic terrain with same seed', () => {
      const terrain1 = new Terrain(800, 600, 42, 0.5);
      const terrain2 = new Terrain(800, 600, 42, 0.5);

      const bitmap1 = terrain1.getBitmap();
      const bitmap2 = terrain2.getBitmap();

      expect(bitmap1).toEqual(bitmap2);
    });
  });

  describe('getHeightAt', () => {
    it('should return height at given x coordinate', () => {
      const height = terrain.getHeightAt(400);
      expect(height).toBeGreaterThanOrEqual(0);
      expect(height).toBeLessThanOrEqual(600);
    });

    it('should return height for boundary coordinates', () => {
      expect(terrain.getHeightAt(0)).toBeGreaterThanOrEqual(0);
      expect(terrain.getHeightAt(799)).toBeGreaterThanOrEqual(0);
    });

    it('should handle out of bounds coordinates', () => {
      expect(terrain.getHeightAt(-10)).toBe(0);
      expect(terrain.getHeightAt(1000)).toBe(0);
    });
  });

  describe('isSolid', () => {
    it('should return true for solid terrain', () => {
      const height = terrain.getHeightAt(400);
      expect(terrain.isSolid(400, height + 10)).toBe(true);
    });

    it('should return false for air', () => {
      expect(terrain.isSolid(400, 0)).toBe(false);
    });

    it('should return false for out of bounds', () => {
      expect(terrain.isSolid(-10, 300)).toBe(false);
      expect(terrain.isSolid(1000, 300)).toBe(false);
    });
  });

  describe('explode', () => {
    it('should remove terrain in blast radius', () => {
      const center = { x: 400, y: 400 };
      const radius = 50;

      // Mark initial state
      const wassolid = terrain.isSolid(center.x, center.y + 10);

      // Explode
      terrain.explode(center, radius);

      // Check that terrain was removed near center
      expect(terrain.isSolid(center.x, center.y)).toBe(false);

      // Terrain further away might have been affected too if it was solid
      if (wassolid) {
        expect(terrain.isSolid(center.x, center.y + 10)).toBe(false);
      }
    });

    it('should not affect terrain outside blast radius', () => {
      const center = { x: 400, y: 400 };
      const radius = 10;

      const farPoint = { x: 500, y: 400 };
      const wasSolid = terrain.isSolid(farPoint.x, farPoint.y);

      terrain.explode(center, radius);

      // Far point should be unchanged
      expect(terrain.isSolid(farPoint.x, farPoint.y)).toBe(wasSolid);
    });
  });

  describe('addDirt', () => {
    it('should add terrain in specified radius', () => {
      const center = { x: 400, y: 100 }; // High in the air
      const radius = 20;

      // Should be air initially
      expect(terrain.isSolid(center.x, center.y)).toBe(false);

      // Add dirt
      terrain.addDirt(center, radius);

      // Should now be solid
      expect(terrain.isSolid(center.x, center.y)).toBe(true);
    });
  });

  describe('getBitmap', () => {
    it('should return bitmap data', () => {
      const bitmap = terrain.getBitmap();
      expect(bitmap).toBeInstanceOf(Uint8Array);
      expect(bitmap.length).toBe(800 * 600);
    });

    it('should contain only 0s and 1s', () => {
      const bitmap = terrain.getBitmap();
      for (let i = 0; i < bitmap.length; i++) {
        expect(bitmap[i]).toBeGreaterThanOrEqual(0);
        expect(bitmap[i]).toBeLessThanOrEqual(1);
      }
    });
  });
});
