/**
 * AI player interface and base class
 */

import { AIDifficulty, WeaponType, Vector2D } from '@/types/game';
import { Terrain } from '@/game/entities/terrain';
import { Tank } from '@/game/entities/tank';

/**
 * AI decision for a turn
 */
export interface AIDecision {
  angle: number;
  power: number;
  weapon: WeaponType;
  shouldMove: boolean;
  moveDirection?: number;
  moveDistance?: number;
}

/**
 * Base AI player class
 */
export abstract class AIPlayer {
  protected difficulty: AIDifficulty;

  constructor(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
  }

  /**
   * Make a decision for the current turn
   */
  abstract makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    terrain: Terrain,
    wind: number,
    gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision;

  /**
   * Select best target from enemy tanks
   */
  protected selectTarget(myTank: Tank, enemyTanks: Tank[]): Tank | null {
    const aliveTanks = enemyTanks.filter((t) => t.getState().isAlive);
    if (aliveTanks.length === 0) return null;

    // Default: target closest tank
    const myPos = myTank.getState().position;
    let closestTank = aliveTanks[0];
    let closestDist = this.distance(myPos, closestTank.getState().position);

    for (const tank of aliveTanks) {
      const dist = this.distance(myPos, tank.getState().position);
      if (dist < closestDist) {
        closestDist = dist;
        closestTank = tank;
      }
    }

    return closestTank;
  }

  /**
   * Calculate distance between two points
   */
  protected distance(a: Vector2D, b: Vector2D): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  /**
   * Check if there's a clear line of sight
   */
  protected hasLineOfSight(
    from: Vector2D,
    to: Vector2D,
    terrain: Terrain
  ): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = dx / steps;
    const stepY = dy / steps;

    for (let i = 0; i < steps; i++) {
      const x = Math.floor(from.x + stepX * i);
      const y = Math.floor(from.y + stepY * i);

      if (terrain.isSolid(x, y)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate ballistic trajectory parameters
   */
  protected calculateTrajectory(
    from: Vector2D,
    to: Vector2D,
    gravity: number,
    _wind: number
  ): { angle: number; power: number } | null {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // Simplified ballistic calculation
    // This is an approximation - more accurate AI will use iterative solving
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Try different angles
    for (let angleDeg = 15; angleDeg <= 75; angleDeg += 5) {
      const angle = (angleDeg * Math.PI) / 180;

      // Calculate required velocity
      const v2 =
        (gravity * distance * distance) /
        (2 * Math.cos(angle) * Math.cos(angle) * (distance * Math.tan(angle) - dy));

      if (v2 > 0 && v2 < 10000) {
        const power = Math.sqrt(v2);
        if (power >= 0 && power <= 100) {
          return { angle: angleDeg, power };
        }
      }
    }

    return null;
  }

  /**
   * Select weapon based on situation
   */
  protected selectWeapon(
    availableWeapons: WeaponType[],
    _targetDistance: number,
    enemyCount: number
  ): WeaponType {
    // Default strategy: use baby missile
    if (availableWeapons.includes(WeaponType.BabyMissile)) {
      return WeaponType.BabyMissile;
    }

    // If enemies are clustered and we have area weapons, use them
    if (enemyCount > 1 && availableWeapons.includes(WeaponType.BabyNuke)) {
      return WeaponType.BabyNuke;
    }

    // Use first available weapon
    return availableWeapons[0] || WeaponType.BabyMissile;
  }
}
