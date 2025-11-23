/**
 * Ballistics and projectile physics
 */

import { Vector2D, ProjectileState, WeaponType } from '@/types/game';
import { addVectors, multiplyVector } from '@/utils/math';

export interface BallisticsConfig {
  gravity: number;
  wind: number;
  deltaTime: number;
}

/**
 * Calculate projectile trajectory step
 */
export function updateProjectile(
  projectile: ProjectileState,
  config: BallisticsConfig
): ProjectileState {
  const { gravity, wind, deltaTime } = config;

  // Apply gravity to velocity
  const gravityForce: Vector2D = { x: 0, y: gravity * deltaTime };
  
  // Apply wind to velocity
  const windForce: Vector2D = { x: wind * deltaTime, y: 0 };

  // Update velocity
  const newVelocity = addVectors(
    addVectors(projectile.velocity, gravityForce),
    windForce
  );

  // Update position
  const displacement = multiplyVector(newVelocity, deltaTime);
  const newPosition = addVectors(projectile.position, displacement);

  // Calculate angle based on velocity
  const angle = Math.atan2(newVelocity.y, newVelocity.x);

  return {
    ...projectile,
    position: newPosition,
    velocity: newVelocity,
    angle,
  };
}

/**
 * Create initial projectile from firing parameters
 */
export function createProjectile(
  id: string,
  weaponType: WeaponType,
  startPosition: Vector2D,
  angle: number,
  power: number,
  ownerId: string
): ProjectileState {
  // Convert angle to radians (angle is in degrees from horizontal)
  const angleRad = (angle * Math.PI) / 180;

  // Calculate initial velocity components
  const velocity: Vector2D = {
    x: Math.cos(angleRad) * power,
    y: -Math.sin(angleRad) * power, // Negative because y increases downward
  };

  return {
    id,
    weaponType,
    position: { ...startPosition },
    velocity,
    angle: angleRad,
    ownerId,
    active: true,
  };
}

/**
 * Predict trajectory points for aiming helper
 */
export function predictTrajectory(
  startPosition: Vector2D,
  angle: number,
  power: number,
  config: BallisticsConfig,
  steps = 100
): Vector2D[] {
  const trajectory: Vector2D[] = [];
  
  let projectile = createProjectile(
    'preview',
    WeaponType.Tracer,
    startPosition,
    angle,
    power,
    'preview'
  );

  for (let i = 0; i < steps; i++) {
    trajectory.push({ ...projectile.position });
    projectile = updateProjectile(projectile, config);
    
    // Stop if projectile goes way off screen
    if (projectile.position.y > 2000 || Math.abs(projectile.position.x) > 2000) {
      break;
    }
  }

  return trajectory;
}
