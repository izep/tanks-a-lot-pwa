/**
 * AI player controller
 */

import { AIDifficulty, WeaponType } from '@/types/game';
import { GameStateManager } from '@/game/state/game-state';
import { Tank } from '@/game/entities/tank';
import { Terrain } from '@/game/entities/terrain';

export class AIController {
  private difficulty: AIDifficulty;

  constructor(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
  }

  /**
   * Calculate AI's move for the turn
   * Returns { angle, power, weapon }
   */
  calculateMove(
    gameState: GameStateManager,
    playerId: string
  ): { angle: number; power: number; weapon: WeaponType } | null {
    const tank = gameState.getTank(playerId);
    const terrain = gameState.getTerrain();
    const state = gameState.getState();

    if (!tank || !terrain) return null;

    // Find target (first alive enemy)
    const currentPlayer = state.players.find((p) => p.config.id === playerId);
    if (!currentPlayer) return null;

    const enemies = state.players.filter(
      (p) => p.tank.isAlive && p.config.id !== playerId
    );

    if (enemies.length === 0) return null;

    const target = enemies[0];

    // Choose weapon (prefer baby missile for now)
    let weapon = WeaponType.BabyMissile;
    if (currentPlayer.inventory[WeaponType.Missile] > 0) {
      weapon = WeaponType.Missile;
    }

    // Calculate shot based on difficulty
    switch (this.difficulty) {
      case AIDifficulty.Moron:
        return this.calculateMoronShot(tank, weapon);
      
      case AIDifficulty.Shooter:
      case AIDifficulty.Tosser:
      case AIDifficulty.Cyborg:
        return this.calculateSmartShot(tank, target.tank, terrain, state.wind, weapon);
      
      default:
        return this.calculateMoronShot(tank, weapon);
    }
  }

  /**
   * Moron AI - completely random shot
   */
  private calculateMoronShot(_tank: Tank, weapon: WeaponType): {
    angle: number;
    power: number;
    weapon: WeaponType;
  } {
    return {
      angle: Math.random() * 180,
      power: Math.random() * 100,
      weapon,
    };
  }

  /**
   * Smart AI - calculate trajectory to hit target
   */
  private calculateSmartShot(
    tank: Tank,
    targetTank: { position: { x: number; y: number } },
    _terrain: Terrain,
    wind: number,
    weapon: WeaponType
  ): { angle: number; power: number; weapon: WeaponType } {
    const tankState = tank.getState();
    const dx = targetTank.position.x - tankState.position.x;
    const dy = targetTank.position.y - tankState.position.y;

    // Simple ballistic calculation
    // For a projectile with gravity and wind, we need to solve for angle and power
    // Simplified: aim at target with some power based on distance

    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Base angle towards target
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    
    // Adjust for wind (simple heuristic)
    angle -= wind * 2;

    // Clamp angle
    angle = Math.max(0, Math.min(180, angle));

    // Power based on distance
    let power = Math.min(100, distance / 5);
    
    // Add some variation for realism (except for Cyborg)
    if (this.difficulty !== AIDifficulty.Cyborg) {
      angle += (Math.random() - 0.5) * 10;
      power += (Math.random() - 0.5) * 20;
    }

    power = Math.max(10, Math.min(100, power));

    return {
      angle,
      power,
      weapon,
    };
  }

  /**
   * AI takes its turn
   */
  async executeTurn(
    gameState: GameStateManager,
    playerId: string,
    onFire: (angle: number, power: number, weapon: WeaponType) => void
  ): Promise<void> {
    // Wait a bit before shooting (looks more natural)
    await this.delay(1000);

    const move = this.calculateMove(gameState, playerId);
    if (!move) return;

    const tank = gameState.getTank(playerId);
    if (!tank) return;

    // Set angle and power
    tank.setAngle(move.angle);
    tank.setPower(move.power);

    // Wait a bit more
    await this.delay(500);

    // Fire
    onFire(move.angle, move.power, move.weapon);
  }

  /**
   * Helper to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
