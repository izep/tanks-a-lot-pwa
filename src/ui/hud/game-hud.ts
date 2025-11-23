/**
 * Game HUD (Heads-Up Display)
 */

import Stage from 'stage-js';
import { GameState, WeaponType } from '@/types/game';
import { getWeaponConfig } from '@/game/weapons/weapon-config';

export class GameHUD {
  private stage: Stage;
  private hudLayer: ReturnType<typeof Stage.create> | null = null;

  constructor(stage: Stage) {
    this.stage = stage;
  }

  /**
   * Update and render the HUD
   */
  update(gameState: GameState, currentWeapon?: WeaponType): void {
    // Remove old HUD
    if (this.hudLayer) {
      this.hudLayer.remove();
    }

    this.hudLayer = Stage.create();

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Current player name
    const playerName = Stage.string(`Player: ${currentPlayer.config.name}`);
    const playerNameSprite = Stage.create().pin({ x: 10, y: 10 });
    playerNameSprite.image(playerName);
    this.hudLayer.append(playerNameSprite);

    // Health bar
    const health = currentPlayer.tank.health;
    const maxHealth = currentPlayer.tank.maxHealth;
    const healthText = Stage.string(`Health: ${health}/${maxHealth}`);
    const healthSprite = Stage.create().pin({ x: 10, y: 30 });
    healthSprite.image(healthText);
    this.hudLayer.append(healthSprite);

    // Money
    const moneyText = Stage.string(`Money: $${currentPlayer.money}`);
    const moneySprite = Stage.create().pin({ x: 10, y: 50 });
    moneySprite.image(moneyText);
    this.hudLayer.append(moneySprite);

    // Angle
    const angleText = Stage.string(`Angle: ${currentPlayer.tank.angle.toFixed(1)}°`);
    const angleSprite = Stage.create().pin({ x: 10, y: 70 });
    angleSprite.image(angleText);
    this.hudLayer.append(angleSprite);

    // Power
    const powerText = Stage.string(`Power: ${currentPlayer.tank.power}`);
    const powerSprite = Stage.create().pin({ x: 10, y: 90 });
    powerSprite.image(powerText);
    this.hudLayer.append(powerSprite);

    // Current weapon
    if (currentWeapon) {
      const weaponConfig = getWeaponConfig(currentWeapon);
      const ammo = currentPlayer.inventory[currentWeapon] || 0;
      const weaponText = Stage.string(`Weapon: ${weaponConfig.name} (${ammo})`);
      const weaponSprite = Stage.create().pin({ x: 10, y: 110 });
      weaponSprite.image(weaponText);
      this.hudLayer.append(weaponSprite);
    }

    // Wind
    const windDirection = gameState.wind >= 0 ? 'Right' : 'Left';
    const windText = Stage.string(`Wind: ${Math.abs(gameState.wind).toFixed(1)} ${windDirection}`);
    const windSprite = Stage.create().pin({ x: 10, y: 130 });
    windSprite.image(windText);
    this.hudLayer.append(windSprite);

    // Round info
    const roundText = Stage.string(`Round: ${gameState.currentRound}/${gameState.config.rounds}`);
    const roundSprite = Stage.create().pin({ x: 600, y: 10 });
    roundSprite.image(roundText);
    this.hudLayer.append(roundSprite);

    // Controls hint
    const hint = Stage.string('Tab: Change Weapon | Arrows: Aim | Space: Fire | Q/E: Move');
    const hintSprite = Stage.create().pin({ x: 200, y: 580 });
    hintSprite.image(hint);
    this.hudLayer.append(hintSprite);

    // Add to stage
    this.stage.append(this.hudLayer);
  }

  /**
   * Clear the HUD
   */
  clear(): void {
    if (this.hudLayer) {
      this.hudLayer.remove();
      this.hudLayer = null;
    }
  }
}
