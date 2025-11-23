/**
 * Collision detection system
 */

import { Vector2D, ProjectileState, TankState } from '@/types/game';
import { Terrain } from '@/game/entities/terrain';
import { distance } from '@/utils/math';

export interface CollisionResult {
  type: 'terrain' | 'tank' | 'boundary' | 'none';
  position: Vector2D;
  tankId?: string;
}

/**
 * Check projectile collision with terrain
 */
export function checkTerrainCollision(
  projectile: ProjectileState,
  terrain: Terrain
): CollisionResult | null {
  const pos = projectile.position;
  const { width, height } = terrain.getDimensions();

  // Check boundaries
  if (pos.x < 0 || pos.x >= width || pos.y >= height) {
    return {
      type: 'boundary',
      position: pos,
    };
  }

  // Check terrain collision
  if (terrain.isSolid(pos.x, pos.y)) {
    return {
      type: 'terrain',
      position: pos,
    };
  }

  return null;
}

/**
 * Check projectile collision with tanks
 */
export function checkTankCollision(
  projectile: ProjectileState,
  tanks: TankState[],
  tankRadius = 10
): CollisionResult | null {
  for (const tank of tanks) {
    if (!tank.isAlive || tank.playerId === projectile.ownerId) {
      continue;
    }

    const dist = distance(projectile.position, tank.position);
    if (dist <= tankRadius) {
      return {
        type: 'tank',
        position: projectile.position,
        tankId: tank.id,
      };
    }
  }

  return null;
}

/**
 * Check all collisions for a projectile
 */
export function checkCollisions(
  projectile: ProjectileState,
  terrain: Terrain,
  tanks: TankState[]
): CollisionResult {
  // Check tank collision first (higher priority)
  const tankCollision = checkTankCollision(projectile, tanks);
  if (tankCollision) {
    return tankCollision;
  }

  // Check terrain collision
  const terrainCollision = checkTerrainCollision(projectile, terrain);
  if (terrainCollision) {
    return terrainCollision;
  }

  return {
    type: 'none',
    position: projectile.position,
  };
}

/**
 * Calculate damage falloff based on distance from explosion
 */
export function calculateDamage(
  targetPosition: Vector2D,
  explosionCenter: Vector2D,
  maxDamage: number,
  blastRadius: number
): number {
  const dist = distance(targetPosition, explosionCenter);
  
  if (dist >= blastRadius) {
    return 0;
  }

  // Linear falloff
  const falloff = 1 - (dist / blastRadius);
  return Math.floor(maxDamage * falloff);
}
