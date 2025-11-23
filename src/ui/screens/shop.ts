/**
 * Shop screen for purchasing weapons and accessories between rounds
 */

import Stage from 'stage-js';
import { GameState } from '@/types/game';
import { getAllWeapons } from '@/game/weapons/weapon-config';

export class ShopScreen {
  private stage: Stage;
  private container: any;
  private onClose: () => void;
  private currentPlayerIndex: number;

  constructor(stage: Stage, onClose: () => void) {
    this.stage = stage;
    this.onClose = onClose;
    this.container = null;
    this.currentPlayerIndex = 0;
  }

  /**
   * Show shop screen for a specific player
   */
  show(gameState: GameState, playerIndex: number): void {
    this.currentPlayerIndex = playerIndex;
    const player = gameState.players[playerIndex];

    if (!player) return;

    // Clear stage
    this.stage.empty();

    // Create shop container
    this.container = Stage.create().pin({
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    });

    // Background
    const bg = Stage.create()
      .pin({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      })
      .image('#1a1a1a');

    this.container.append(bg);

    // Title
    const title = Stage.create()
      .pin({
        x: 400,
        y: 30,
        align: 0.5,
      })
      .image(this.createTextImage(`${player.config.name}'s Shop`, 32, '#ffffff'));

    this.container.append(title);

    // Player money display
    const moneyText = Stage.create()
      .pin({
        x: 400,
        y: 70,
        align: 0.5,
      })
      .image(this.createTextImage(`Money: $${player.money}`, 24, '#00ff00'));

    this.container.append(moneyText);

    // Weapons list
    const weapons = getAllWeapons();
    const scrollY = 120;
    const itemHeight = 50;
    const itemsPerPage = 8;
    const displayWeapons = weapons.slice(0, itemsPerPage);

    displayWeapons.forEach((weapon, index) => {
      this.createWeaponItem(weapon, index, scrollY, itemHeight, player);
    });

    // Done button
    const doneButton = this.createButton('Done Shopping', 400, 550, () => {
      this.close();
    });

    this.container.append(doneButton);

    this.stage.append(this.container);
  }

  /**
   * Create weapon item row
   */
  private createWeaponItem(
    weaponConfig: any,
    index: number,
    startY: number,
    itemHeight: number,
    player: any
  ): void {
    const y = startY + index * itemHeight;
    const canAfford = player.money >= weaponConfig.cost;

    // Background for item
    const itemBg = Stage.create()
      .pin({
        x: 50,
        y: y,
        width: 700,
        height: itemHeight - 5,
      })
      .image(canAfford ? '#2a2a2a' : '#1a1a1a');

    this.container.append(itemBg);

    // Weapon name
    const nameText = Stage.create()
      .pin({
        x: 60,
        y: y + 5,
      })
      .image(
        this.createTextImage(weaponConfig.name, 18, canAfford ? '#ffffff' : '#666666')
      );

    this.container.append(nameText);

    // Cost
    const costText = Stage.create()
      .pin({
        x: 250,
        y: y + 5,
      })
      .image(
        this.createTextImage(
          `$${weaponConfig.cost}`,
          18,
          canAfford ? '#00ff00' : '#ff0000'
        )
      );

    this.container.append(costText);

    // Bundle size
    const bundleText = Stage.create()
      .pin({
        x: 350,
        y: y + 5,
      })
      .image(this.createTextImage(`x${weaponConfig.bundleSize}`, 18, '#aaaaaa'));

    this.container.append(bundleText);

    // Current inventory
    const currentCount = player.inventory[weaponConfig.type] || 0;
    const invText = Stage.create()
      .pin({
        x: 450,
        y: y + 5,
      })
      .image(this.createTextImage(`Owned: ${currentCount}`, 18, '#aaaaaa'));

    this.container.append(invText);

    // Buy button
    if (canAfford) {
      const buyButton = this.createButton('Buy', 650, y + 10, () => {
        this.buyWeapon(player, weaponConfig);
        this.show(this.getGameState(), this.currentPlayerIndex);
      });

      this.container.append(buyButton);
    }
  }

  /**
   * Buy weapon for player
   */
  private buyWeapon(player: any, weaponConfig: any): void {
    if (player.money >= weaponConfig.cost) {
      player.money -= weaponConfig.cost;
      const currentCount = player.inventory[weaponConfig.type] || 0;
      player.inventory[weaponConfig.type] = Math.min(
        99,
        currentCount + weaponConfig.bundleSize
      );
    }
  }

  /**
   * Create button sprite
   */
  private createButton(
    text: string,
    x: number,
    y: number,
    onClick: () => void
  ): any {
    const button = Stage.create().pin({
      x: x,
      y: y,
      align: 0.5,
    });

    const bg = Stage.create()
      .pin({
        width: 120,
        height: 30,
        align: 0.5,
      })
      .image('#0066cc');

    button.append(bg);

    const label = Stage.create()
      .pin({
        x: 0,
        y: 0,
        align: 0.5,
      })
      .image(this.createTextImage(text, 16, '#ffffff'));

    button.append(label);

    // Add click handler
    button.on('click', onClick);

    return button;
  }

  /**
   * Create text image using canvas
   */
  private createTextImage(text: string, fontSize: number, color: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = fontSize + 10;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '#ffffff';

    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 0, 0);

    return canvas.toDataURL();
  }

  /**
   * Get game state (stub - will be passed from caller)
   */
  private getGameState(): GameState {
    // This is a temporary implementation
    // In practice, the game state should be passed from the caller
    return {} as GameState;
  }

  /**
   * Close shop
   */
  close(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    this.onClose();
  }
}
