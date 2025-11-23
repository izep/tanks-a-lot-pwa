/**
 * Tank entity class
 */

import { TankState, Vector2D } from '@/types/game';
import { Terrain } from './terrain';

export class Tank {
  private state: TankState;

  constructor(
    id: string,
    playerId: string,
    position: Vector2D,
    maxHealth = 100
  ) {
    this.state = {
      id,
      playerId,
      position: { ...position },
      health: maxHealth,
      maxHealth,
      angle: 45, // Default firing angle
      power: 50, // Default power (0-100)
      fuel: 0,
      shield: 0,
      isAlive: true,
    };
  }

  /**
   * Get current tank state
   */
  getState(): TankState {
    return { ...this.state };
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    if (!this.state.isAlive) return;

    // Shield absorbs damage first
    if (this.state.shield > 0) {
      const shieldDamage = Math.min(this.state.shield, amount);
      this.state.shield -= shieldDamage;
      amount -= shieldDamage;
    }

    // Apply remaining damage to health
    this.state.health = Math.max(0, this.state.health - amount);

    if (this.state.health <= 0) {
      this.state.isAlive = false;
    }
  }

  /**
   * Heal tank
   */
  heal(amount: number): void {
    this.state.health = Math.min(this.state.maxHealth, this.state.health + amount);
  }

  /**
   * Add shield
   */
  addShield(amount: number): void {
    this.state.shield += amount;
  }

  /**
   * Add fuel
   */
  addFuel(amount: number): void {
    this.state.fuel += amount;
  }

  /**
   * Set firing angle
   */
  setAngle(angle: number): void {
    this.state.angle = Math.max(0, Math.min(180, angle));
  }

  /**
   * Set firing power
   */
  setPower(power: number): void {
    this.state.power = Math.max(0, Math.min(100, power));
  }

  /**
   * Move tank left or right
   */
  move(direction: -1 | 1, distance: number, terrain: Terrain): boolean {
    if (!this.state.isAlive || this.state.fuel <= 0) {
      return false;
    }

    const targetX = this.state.position.x + (direction * distance);
    const { width } = terrain.getDimensions();

    // Check bounds
    if (targetX < 0 || targetX >= width) {
      return false;
    }

    // Get terrain height at target position
    const targetY = terrain.getHeightAt(targetX);

    // Check slope (can't climb too steep)
    const currentY = this.state.position.y;
    const slopeAngle = Math.abs(Math.atan2(targetY - currentY, distance) * (180 / Math.PI));
    
    if (slopeAngle > 45) {
      return false; // Too steep
    }

    // Move and consume fuel
    this.state.position.x = targetX;
    this.state.position.y = targetY;
    this.state.fuel = Math.max(0, this.state.fuel - distance);

    return true;
  }

  /**
   * Update tank position based on terrain
   * (e.g., after terrain is destroyed beneath it)
   */
  updatePosition(terrain: Terrain): boolean {
    const groundY = terrain.getHeightAt(this.state.position.x);
    const startY = this.state.position.y;
    
    // Check if tank needs to fall
    if (groundY > startY) {
      this.state.position.y = groundY;
      
      // Calculate fall damage
      const fallDistance = groundY - startY;
      if (fallDistance > 20) {
        const damage = Math.floor((fallDistance - 20) * 2);
        this.takeDamage(damage);
        return true; // Fell
      }
    }

    return false;
  }

  /**
   * Get barrel tip position for projectile spawning
   */
  getBarrelTip(barrelLength = 15): Vector2D {
    const angleRad = (this.state.angle * Math.PI) / 180;
    return {
      x: this.state.position.x + Math.cos(angleRad) * barrelLength,
      y: this.state.position.y - Math.sin(angleRad) * barrelLength,
    };
  }
}
