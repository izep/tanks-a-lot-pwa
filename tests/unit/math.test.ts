/**
 * Tests for math utilities
 */

import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  degToRad,
  radToDeg,
  distance,
  normalize,
  addVectors,
  subtractVectors,
  multiplyVector,
  random,
  randomInt,
  SeededRandom,
} from '@/utils/math';

describe('Math Utilities', () => {
  describe('clamp', () => {
    it('should clamp value within min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('degToRad', () => {
    it('should convert degrees to radians', () => {
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
      expect(degToRad(0)).toBe(0);
    });
  });

  describe('radToDeg', () => {
    it('should convert radians to degrees', () => {
      expect(radToDeg(Math.PI)).toBeCloseTo(180);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
      expect(radToDeg(0)).toBe(0);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
      expect(distance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
    });
  });

  describe('normalize', () => {
    it('should normalize a vector', () => {
      const result = normalize({ x: 3, y: 4 });
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
    });

    it('should handle zero vector', () => {
      const result = normalize({ x: 0, y: 0 });
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });

  describe('addVectors', () => {
    it('should add two vectors', () => {
      const result = addVectors({ x: 1, y: 2 }, { x: 3, y: 4 });
      expect(result).toEqual({ x: 4, y: 6 });
    });
  });

  describe('subtractVectors', () => {
    it('should subtract two vectors', () => {
      const result = subtractVectors({ x: 5, y: 7 }, { x: 2, y: 3 });
      expect(result).toEqual({ x: 3, y: 4 });
    });
  });

  describe('multiplyVector', () => {
    it('should multiply vector by scalar', () => {
      const result = multiplyVector({ x: 2, y: 3 }, 3);
      expect(result).toEqual({ x: 6, y: 9 });
    });
  });

  describe('random', () => {
    it('should generate number within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = random(5, 10);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThan(10);
      }
    });
  });

  describe('randomInt', () => {
    it('should generate integer within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(5, 10);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('SeededRandom', () => {
    it('should generate deterministic sequence', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);

      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });

    it('should generate different sequences for different seeds', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(43);

      expect(rng1.next()).not.toBe(rng2.next());
    });
  });
});
