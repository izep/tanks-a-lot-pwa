/**
 * Tests for ballistics physics
 */

import { describe, it, expect } from 'vitest';
import {
  updateProjectile,
  createProjectile,
  predictTrajectory,
} from '@/game/physics/ballistics';
import { WeaponType } from '@/types/game';

describe('Ballistics', () => {
  describe('createProjectile', () => {
    it('should create projectile with correct initial velocity', () => {
      const projectile = createProjectile(
        'test-1',
        WeaponType.Missile,
        { x: 100, y: 100 },
        45, // 45 degrees
        50, // power
        'player-1'
      );

      expect(projectile.id).toBe('test-1');
      expect(projectile.weaponType).toBe(WeaponType.Missile);
      expect(projectile.position).toEqual({ x: 100, y: 100 });
      expect(projectile.ownerId).toBe('player-1');
      expect(projectile.active).toBe(true);

      // At 45 degrees, x and y velocity should be roughly equal
      expect(Math.abs(projectile.velocity.x - Math.abs(projectile.velocity.y))).toBeLessThan(1);
    });

    it('should create horizontal projectile at 0 degrees', () => {
      const projectile = createProjectile(
        'test-2',
        WeaponType.Missile,
        { x: 100, y: 100 },
        0, // horizontal
        100,
        'player-1'
      );

      expect(projectile.velocity.x).toBeCloseTo(100);
      expect(projectile.velocity.y).toBeCloseTo(0);
    });

    it('should create vertical projectile at 90 degrees', () => {
      const projectile = createProjectile(
        'test-3',
        WeaponType.Missile,
        { x: 100, y: 100 },
        90, // vertical
        100,
        'player-1'
      );

      expect(projectile.velocity.x).toBeCloseTo(0);
      expect(Math.abs(projectile.velocity.y)).toBeCloseTo(100);
    });
  });

  describe('updateProjectile', () => {
    it('should apply gravity to projectile', () => {
      let projectile = createProjectile(
        'test-1',
        WeaponType.Missile,
        { x: 100, y: 100 },
        45,
        50,
        'player-1'
      );

      const initialVelocityY = projectile.velocity.y;

      projectile = updateProjectile(projectile, {
        gravity: 0.5,
        wind: 0,
        deltaTime: 1,
      });

      // Gravity should increase downward velocity
      expect(projectile.velocity.y).toBeGreaterThan(initialVelocityY);
    });

    it('should apply wind to projectile', () => {
      let projectile = createProjectile(
        'test-1',
        WeaponType.Missile,
        { x: 100, y: 100 },
        45,
        50,
        'player-1'
      );

      const initialVelocityX = projectile.velocity.x;

      projectile = updateProjectile(projectile, {
        gravity: 0,
        wind: 2, // Positive wind (right)
        deltaTime: 1,
      });

      // Wind should increase horizontal velocity
      expect(projectile.velocity.x).toBeGreaterThan(initialVelocityX);
    });

    it('should update position based on velocity', () => {
      let projectile = createProjectile(
        'test-1',
        WeaponType.Missile,
        { x: 100, y: 100 },
        0, // horizontal
        100,
        'player-1'
      );

      const initialX = projectile.position.x;

      projectile = updateProjectile(projectile, {
        gravity: 0,
        wind: 0,
        deltaTime: 1,
      });

      // Position should move right
      expect(projectile.position.x).toBeGreaterThan(initialX);
    });
  });

  describe('predictTrajectory', () => {
    it('should return array of trajectory points', () => {
      const trajectory = predictTrajectory(
        { x: 100, y: 100 },
        45,
        50,
        {
          gravity: 0.5,
          wind: 0,
          deltaTime: 0.1,
        },
        50
      );

      expect(trajectory.length).toBeGreaterThan(0);
      expect(trajectory.length).toBeLessThanOrEqual(50);
      expect(trajectory[0]).toEqual({ x: 100, y: 100 });
    });

    it('should show projectile moving forward', () => {
      const trajectory = predictTrajectory(
        { x: 100, y: 100 },
        45,
        50,
        {
          gravity: 0.5,
          wind: 0,
          deltaTime: 0.1,
        },
        50
      );

      // X should generally increase (moving forward)
      expect(trajectory[trajectory.length - 1].x).toBeGreaterThan(trajectory[0].x);

      // Trajectory should have multiple points
      expect(trajectory.length).toBeGreaterThan(10);
    });
  });
});
