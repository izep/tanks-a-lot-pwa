/**
 * Concrete AI implementations for different difficulty levels
 */

import { AIPlayer, AIDecision } from './ai-player';
import { AIDifficulty, WeaponType } from '@/types/game';
import { Terrain } from '@/game/entities/terrain';
import { Tank } from '@/game/entities/tank';

/**
 * Moron AI: Random angle and power, rarely hits targets
 */
export class MoronAI extends AIPlayer {
  constructor() {
    super(AIDifficulty.Moron);
  }

  makeDecision(
    _myTank: Tank,
    enemyTanks: Tank[],
    _terrain: Terrain,
    _wind: number,
    _gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    return {
      angle: Math.random() * 90, // 0-90 degrees
      power: Math.random() * 100, // 0-100 power
      weapon: this.selectWeapon(availableWeapons, 0, enemyTanks.length),
      shouldMove: false,
    };
  }
}

/**
 * Shooter AI: Aims directly at targets if unobstructed
 */
export class ShooterAI extends AIPlayer {
  constructor() {
    super(AIDifficulty.Shooter);
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    _terrain: Terrain,
    _wind: number,
    _gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    const target = this.selectTarget(myTank, enemyTanks);
    if (!target) {
      return {
        angle: 45,
        power: 50,
        weapon: WeaponType.BabyMissile,
        shouldMove: false,
      };
    }

    const myPos = myTank.getState().position;
    const targetPos = target.getState().position;

    // Calculate basic angle to target
    const dx = targetPos.x - myPos.x;
    const dy = targetPos.y - myPos.y;
    let angle = (Math.atan2(-dy, Math.abs(dx)) * 180) / Math.PI;

    // Clamp angle
    angle = Math.max(0, Math.min(90, angle));

    // Simple power based on distance
    const distance = this.distance(myPos, targetPos);
    const power = Math.min(100, distance / 5);

    return {
      angle,
      power,
      weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
      shouldMove: false,
    };
  }
}

/**
 * Tosser AI: Adjusts shots incrementally, improving aim with each attempt
 */
export class TosserAI extends AIPlayer {
  private lastShot: { angle: number; power: number } | null = null;

  constructor() {
    super(AIDifficulty.Tosser);
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    _terrain: Terrain,
    _wind: number,
    _gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    const target = this.selectTarget(myTank, enemyTanks);
    if (!target) {
      return {
        angle: 45,
        power: 50,
        weapon: WeaponType.BabyMissile,
        shouldMove: false,
      };
    }

    const myPos = myTank.getState().position;
    const targetPos = target.getState().position;
    const distance = this.distance(myPos, targetPos);

    let angle: number;
    let power: number;

    if (this.lastShot) {
      // Adjust from last shot (simplified - in real game would track miss direction)
      const adjustment = (Math.random() - 0.5) * 10;
      angle = Math.max(0, Math.min(90, this.lastShot.angle + adjustment));
      power = Math.max(0, Math.min(100, this.lastShot.power + adjustment));
    } else {
      // First shot - estimate
      angle = 45;
      power = Math.min(100, distance / 5);
    }

    this.lastShot = { angle, power };

    return {
      angle,
      power,
      weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
      shouldMove: false,
    };
  }
}

/**
 * Cyborg AI: Uses predictive algorithms for precise shots
 */
export class CyborgAI extends AIPlayer {
  constructor() {
    super(AIDifficulty.Cyborg);
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    _terrain: Terrain,
    wind: number,
    gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    const target = this.selectTarget(myTank, enemyTanks);
    if (!target) {
      return {
        angle: 45,
        power: 50,
        weapon: WeaponType.BabyMissile,
        shouldMove: false,
      };
    }

    const myPos = myTank.getState().position;
    const targetPos = target.getState().position;
    const distance = this.distance(myPos, targetPos);

    // Use trajectory calculation
    const trajectory = this.calculateTrajectory(myPos, targetPos, gravity, wind);

    if (trajectory) {
      // Add small random error to make it beatable
      const errorMargin = 2;
      const angle = trajectory.angle + (Math.random() - 0.5) * errorMargin;
      const power = trajectory.power + (Math.random() - 0.5) * errorMargin;

      return {
        angle: Math.max(0, Math.min(90, angle)),
        power: Math.max(0, Math.min(100, power)),
        weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
        shouldMove: false,
      };
    }

    // Fallback if calculation fails
    return {
      angle: 45,
      power: Math.min(100, distance / 5),
      weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
      shouldMove: false,
    };
  }
}

/**
 * Poolshark AI: Specializes in bank shots
 */
export class PoolsharkAI extends AIPlayer {
  constructor() {
    super(AIDifficulty.Poolshark);
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    _terrain: Terrain,
    _wind: number,
    _gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    const target = this.selectTarget(myTank, enemyTanks);
    if (!target) {
      return {
        angle: 45,
        power: 50,
        weapon: WeaponType.BabyMissile,
        shouldMove: false,
      };
    }

    const myPos = myTank.getState().position;
    const targetPos = target.getState().position;
    const distance = this.distance(myPos, targetPos);

    // Use high angle for lobbing shots
    const angle = 60 + Math.random() * 20; // 60-80 degrees for arcing shots
    const power = Math.min(100, distance / 4);

    return {
      angle,
      power,
      weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
      shouldMove: false,
    };
  }
}

/**
 * Chooser AI: Selects best tactic based on situation
 */
export class ChooserAI extends AIPlayer {
  private strategies: AIPlayer[];

  constructor() {
    super(AIDifficulty.Chooser);
    this.strategies = [new ShooterAI(), new CyborgAI(), new PoolsharkAI()];
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    terrain: Terrain,
    wind: number,
    gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    const target = this.selectTarget(myTank, enemyTanks);
    if (!target) {
      return {
        angle: 45,
        power: 50,
        weapon: WeaponType.BabyMissile,
        shouldMove: false,
      };
    }

    const myPos = myTank.getState().position;
    const targetPos = target.getState().position;

    // Choose strategy based on line of sight
    const hasLoS = this.hasLineOfSight(myPos, targetPos, terrain);

    let strategy: AIPlayer;
    if (hasLoS) {
      strategy = this.strategies[0]; // Use Shooter for clear shots
    } else {
      strategy = this.strategies[2]; // Use Poolshark for arc shots
    }

    return strategy.makeDecision(
      myTank,
      enemyTanks,
      terrain,
      wind,
      gravity,
      availableWeapons
    );
  }
}

/**
 * Spoiler AI: Highly accurate, prioritizes weakened tanks
 */
export class SpoilerAI extends AIPlayer {
  constructor() {
    super(AIDifficulty.Spoiler);
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    _terrain: Terrain,
    wind: number,
    gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    // Find weakest tank
    const aliveTanks = enemyTanks.filter((t) => t.getState().isAlive);
    if (aliveTanks.length === 0) {
      return {
        angle: 45,
        power: 50,
        weapon: WeaponType.BabyMissile,
        shouldMove: false,
      };
    }

    let weakestTank = aliveTanks[0];
    let lowestHealth = weakestTank.getState().health;

    for (const tank of aliveTanks) {
      if (tank.getState().health < lowestHealth) {
        lowestHealth = tank.getState().health;
        weakestTank = tank;
      }
    }

    const myPos = myTank.getState().position;
    const targetPos = weakestTank.getState().position;
    const distance = this.distance(myPos, targetPos);

    // Use very accurate calculation
    const trajectory = this.calculateTrajectory(myPos, targetPos, gravity, wind);

    if (trajectory) {
      return {
        angle: trajectory.angle,
        power: trajectory.power,
        weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
        shouldMove: false,
      };
    }

    // Fallback
    return {
      angle: 45,
      power: Math.min(100, distance / 5),
      weapon: this.selectWeapon(availableWeapons, distance, enemyTanks.length),
      shouldMove: false,
    };
  }
}

/**
 * Unknown AI: Randomly selects an AI type for unpredictability
 */
export class UnknownAI extends AIPlayer {
  private actualAI: AIPlayer;

  constructor() {
    super(AIDifficulty.Unknown);

    // Randomly select an AI type
    const aiTypes = [
      MoronAI,
      ShooterAI,
      TosserAI,
      CyborgAI,
      PoolsharkAI,
      ChooserAI,
      SpoilerAI,
    ];
    const RandomAIType = aiTypes[Math.floor(Math.random() * aiTypes.length)];
    this.actualAI = new RandomAIType();
  }

  makeDecision(
    myTank: Tank,
    enemyTanks: Tank[],
    terrain: Terrain,
    wind: number,
    gravity: number,
    availableWeapons: WeaponType[]
  ): AIDecision {
    return this.actualAI.makeDecision(
      myTank,
      enemyTanks,
      terrain,
      wind,
      gravity,
      availableWeapons
    );
  }
}

/**
 * Factory function to create AI player by difficulty
 */
export function createAI(difficulty: AIDifficulty): AIPlayer {
  switch (difficulty) {
    case AIDifficulty.Moron:
      return new MoronAI();
    case AIDifficulty.Shooter:
      return new ShooterAI();
    case AIDifficulty.Tosser:
      return new TosserAI();
    case AIDifficulty.Cyborg:
      return new CyborgAI();
    case AIDifficulty.Poolshark:
      return new PoolsharkAI();
    case AIDifficulty.Chooser:
      return new ChooserAI();
    case AIDifficulty.Spoiler:
      return new SpoilerAI();
    case AIDifficulty.Unknown:
      return new UnknownAI();
    default:
      return new ShooterAI();
  }
}
