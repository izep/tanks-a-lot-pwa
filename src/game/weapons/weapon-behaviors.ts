/**
 * Special weapon behaviors and effects
 * This module defines how special weapons (MIRVs, rollers, diggers, etc.) behave
 */

import { WeaponType } from '@/types/game';

/**
 * Weapon behavior interface for special weapons
 * Most weapons use standard explosion behavior
 */
export interface WeaponBehavior {
  readonly weaponType: WeaponType;
  readonly description: string;
}

/**
 * MIRV behavior: Splits into multiple sub-munitions
 */
export class MIRVBehavior implements WeaponBehavior {
  readonly weaponType = WeaponType.MIRV;
  readonly description = 'Splits into 5 sub-munitions mid-flight';
  readonly subMunitionCount = 5;
  readonly spreadAngle = 30;
}

/**
 * Roller behavior: Rolls along terrain
 */
export class RollerBehavior implements WeaponBehavior {
  readonly weaponType: WeaponType;
  readonly description = 'Rolls downhill and explodes on flat ground';

  constructor(weaponType: WeaponType) {
    this.weaponType = weaponType;
  }
}

/**
 * Get weapon behavior by type
 */
export function getWeaponBehavior(weaponType: WeaponType): WeaponBehavior | null {
  switch (weaponType) {
    case WeaponType.MIRV:
    case WeaponType.DeathsHead:
      return new MIRVBehavior();

    case WeaponType.BabyRoller:
    case WeaponType.Roller:
    case WeaponType.HeavyRoller:
      return new RollerBehavior(weaponType);

    default:
      return null; // Standard explosion
  }
}
