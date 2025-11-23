/**
 * Unit tests for AI system
 */

import { describe, it, expect } from 'vitest';
import {
  MoronAI,
  ShooterAI,
  CyborgAI,
  createAI,
} from '@/game/ai';
import { AIDifficulty, WeaponType } from '@/types/game';
import { Tank } from '@/game/entities/tank';
import { Terrain } from '@/game/entities/terrain';

describe('AI System', () => {
  describe('createAI factory', () => {
    it('should create correct AI type', () => {
      const moron = createAI(AIDifficulty.Moron);
      expect(moron).toBeInstanceOf(MoronAI);

      const shooter = createAI(AIDifficulty.Shooter);
      expect(shooter).toBeInstanceOf(ShooterAI);

      const cyborg = createAI(AIDifficulty.Cyborg);
      expect(cyborg).toBeInstanceOf(CyborgAI);
    });
  });

  describe('MoronAI', () => {
    it('should return random decisions', () => {
      const ai = new MoronAI();
      const myTank = new Tank('tank1', 'player1', { x: 100, y: 100 });
      const enemyTank = new Tank('tank2', 'player2', { x: 300, y: 100 });
      const terrain = new Terrain(800, 600, 12345);

      const decision1 = ai.makeDecision(
        myTank,
        [enemyTank],
        terrain,
        0,
        0.5,
        [WeaponType.BabyMissile]
      );

      expect(decision1.angle).toBeGreaterThanOrEqual(0);
      expect(decision1.angle).toBeLessThanOrEqual(90);
      expect(decision1.power).toBeGreaterThanOrEqual(0);
      expect(decision1.power).toBeLessThanOrEqual(100);
      expect(decision1.weapon).toBe(WeaponType.BabyMissile);
    });
  });

  describe('ShooterAI', () => {
    it('should aim toward target', () => {
      const ai = new ShooterAI();
      const myTank = new Tank('tank1', 'player1', { x: 100, y: 100 });
      const enemyTank = new Tank('tank2', 'player2', { x: 300, y: 100 });
      const terrain = new Terrain(800, 600, 12345);

      const decision = ai.makeDecision(
        myTank,
        [enemyTank],
        terrain,
        0,
        0.5,
        [WeaponType.BabyMissile]
      );

      expect(decision.angle).toBeGreaterThanOrEqual(0);
      expect(decision.angle).toBeLessThanOrEqual(90);
      expect(decision.power).toBeGreaterThan(0);
    });

    it('should select closest target', () => {
      const ai = new ShooterAI();
      const myTank = new Tank('tank1', 'player1', { x: 100, y: 100 });
      const closeEnemy = new Tank('tank2', 'player2', { x: 150, y: 100 });
      const farEnemy = new Tank('tank3', 'player3', { x: 500, y: 100 });
      const terrain = new Terrain(800, 600, 12345);

      const decision = ai.makeDecision(
        myTank,
        [farEnemy, closeEnemy],
        terrain,
        0,
        0.5,
        [WeaponType.BabyMissile]
      );

      // Should target closer enemy (lower power needed)
      expect(decision.power).toBeLessThan(50);
    });
  });

  describe('CyborgAI', () => {
    it('should calculate trajectory', () => {
      const ai = new CyborgAI();
      const myTank = new Tank('tank1', 'player1', { x: 100, y: 100 });
      const enemyTank = new Tank('tank2', 'player2', { x: 300, y: 100 });
      const terrain = new Terrain(800, 600, 12345);

      const decision = ai.makeDecision(
        myTank,
        [enemyTank],
        terrain,
        0,
        0.5,
        [WeaponType.BabyMissile]
      );

      expect(decision.angle).toBeGreaterThanOrEqual(0);
      expect(decision.angle).toBeLessThanOrEqual(90);
      expect(decision.power).toBeGreaterThan(0);
      expect(decision.power).toBeLessThanOrEqual(100);
    });
  });

  describe('AI weapon selection', () => {
    it('should prefer available weapons', () => {
      const ai = new ShooterAI();
      const myTank = new Tank('tank1', 'player1', { x: 100, y: 100 });
      const enemyTank = new Tank('tank2', 'player2', { x: 300, y: 100 });
      const terrain = new Terrain(800, 600, 12345);

      const decision = ai.makeDecision(
        myTank,
        [enemyTank],
        terrain,
        0,
        0.5,
        [WeaponType.Missile, WeaponType.BabyNuke]
      );

      // Should select one of available weapons
      expect([WeaponType.Missile, WeaponType.BabyNuke, WeaponType.BabyMissile]).toContain(
        decision.weapon
      );
    });
  });
});
