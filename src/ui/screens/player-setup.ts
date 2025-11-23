/**
 * Player setup screen for configuring game participants
 */

import Stage from 'stage-js';
import { PlayerConfig, PlayerType, AIDifficulty, Color } from '@/types/game';

// Type alias for Stage node
type StageNode = ReturnType<typeof Stage.create>;

export interface PlayerSetupConfig {
  playerConfigs: PlayerConfig[];
  onStart: (configs: PlayerConfig[]) => void;
  onCancel: () => void;
}

export class PlayerSetupScreen {
  private stage: Stage;
  private container: StageNode | null = null;
  private config: PlayerSetupConfig;
  private playerConfigs: PlayerConfig[];

  constructor(stage: Stage, config: PlayerSetupConfig) {
    this.stage = stage;
    this.config = config;
    this.playerConfigs = config.playerConfigs;
  }

  /**
   * Show player setup screen
   */
  show(): void {
    // Clear stage
    this.stage.empty();

    // Create container
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
      .image(this.createTextImage('Player Setup', 32, '#ffffff'));

    this.container.append(title);

    // Instructions
    const instructions = Stage.create()
      .pin({
        x: 400,
        y: 70,
        align: 0.5,
      })
      .image(
        this.createTextImage(
          'Configure players (2-10). Click to edit.',
          18,
          '#aaaaaa'
        )
      );

    this.container.append(instructions);

    // Player list
    this.renderPlayerList();

    // Add player button (if less than 10)
    if (this.playerConfigs.length < 10) {
      const addButton = this.createButton('Add Player', 150, 550, () => {
        this.addPlayer();
      });
      this.container.append(addButton);
    }

    // Start game button (if at least 2 players)
    if (this.playerConfigs.length >= 2) {
      const startButton = this.createButton('Start Game', 400, 550, () => {
        this.config.onStart(this.playerConfigs);
      });
      this.container.append(startButton);
    }

    // Cancel button
    const cancelButton = this.createButton('Cancel', 650, 550, () => {
      this.config.onCancel();
    });
    this.container.append(cancelButton);

    this.stage.append(this.container);
  }

  /**
   * Render list of players
   */
  private renderPlayerList(): void {
    if (!this.container) return;

    const startY = 120;
    const itemHeight = 50;

    this.playerConfigs.forEach((player, index) => {
      this.renderPlayerItem(player, index, startY + index * itemHeight, itemHeight);
    });
  }

  /**
   * Render single player item
   */
  private renderPlayerItem(
    player: PlayerConfig,
    index: number,
    y: number,
    height: number
  ): void {
    if (!this.container) return;

    // Background
    const bg = Stage.create()
      .pin({
        x: 50,
        y: y,
        width: 700,
        height: height - 5,
      })
      .image('#2a2a2a');

    this.container.append(bg);

    // Player number
    const numberText = Stage.create()
      .pin({
        x: 60,
        y: y + 15,
      })
      .image(this.createTextImage(`P${index + 1}`, 18, '#ffffff'));

    this.container.append(numberText);

    // Player name
    const nameText = Stage.create()
      .pin({
        x: 100,
        y: y + 15,
      })
      .image(this.createTextImage(player.name, 18, '#ffffff'));

    this.container.append(nameText);

    // Player type
    const typeText = Stage.create()
      .pin({
        x: 250,
        y: y + 15,
      })
      .image(
        this.createTextImage(
          player.type === PlayerType.Human ? 'Human' : 'AI',
          18,
          '#00ff00'
        )
      );

    this.container.append(typeText);

    // AI difficulty (if AI)
    if (player.type === PlayerType.AI && player.aiDifficulty) {
      const diffText = Stage.create()
        .pin({
          x: 350,
          y: y + 15,
        })
        .image(
          this.createTextImage(
            this.capitalizeFirst(player.aiDifficulty),
            18,
            '#ffaa00'
          )
        );

      this.container.append(diffText);
    }

    // Color indicator
    const colorBox = Stage.create()
      .pin({
        x: 500,
        y: y + 10,
        width: 30,
        height: 30,
      })
      .image(this.rgbToHex(player.color));

    this.container.append(colorBox);

    // Edit button
    const editButton = this.createSmallButton('Edit', 600, y + 10, () => {
      this.editPlayer(index);
    });

    this.container.append(editButton);

    // Remove button (if more than 2 players)
    if (this.playerConfigs.length > 2) {
      const removeButton = this.createSmallButton('Remove', 670, y + 10, () => {
        this.removePlayer(index);
      });

      this.container.append(removeButton);
    }
  }

  /**
   * Add new player
   */
  private addPlayer(): void {
    const colors: Color[] = [
      { r: 255, g: 0, b: 0 }, // Red
      { r: 0, g: 0, b: 255 }, // Blue
      { r: 0, g: 255, b: 0 }, // Green
      { r: 255, g: 255, b: 0 }, // Yellow
      { r: 255, g: 0, b: 255 }, // Magenta
      { r: 0, g: 255, b: 255 }, // Cyan
      { r: 255, g: 128, b: 0 }, // Orange
      { r: 128, g: 0, b: 255 }, // Purple
      { r: 128, g: 128, b: 128 }, // Gray
      { r: 255, g: 255, b: 255 }, // White
    ];

    const newPlayer: PlayerConfig = {
      id: `player${this.playerConfigs.length + 1}`,
      name: `Player ${this.playerConfigs.length + 1}`,
      type: PlayerType.Human,
      color: colors[this.playerConfigs.length % colors.length],
    };

    this.playerConfigs.push(newPlayer);
    this.show(); // Re-render
  }

  /**
   * Remove player
   */
  private removePlayer(index: number): void {
    if (this.playerConfigs.length > 2) {
      this.playerConfigs.splice(index, 1);
      this.show(); // Re-render
    }
  }

  /**
   * Edit player (simple toggle for demo)
   */
  private editPlayer(index: number): void {
    const player = this.playerConfigs[index];

    // Simple toggle between Human and AI for demo
    if (player.type === PlayerType.Human) {
      player.type = PlayerType.AI;
      player.aiDifficulty = AIDifficulty.Shooter; // Default AI
    } else {
      // Cycle through AI difficulties
      const difficulties = Object.values(AIDifficulty);
      const currentIndex = difficulties.indexOf(
        player.aiDifficulty || AIDifficulty.Moron
      );
      const nextIndex = (currentIndex + 1) % difficulties.length;

      if (nextIndex === 0) {
        // Back to human
        player.type = PlayerType.Human;
        delete player.aiDifficulty;
      } else {
        player.aiDifficulty = difficulties[nextIndex];
      }
    }

    this.show(); // Re-render
  }

  /**
   * Create button sprite
   */
  private createButton(
    text: string,
    x: number,
    y: number,
    onClick: () => void
  ): StageNode {
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

    button.on('click', onClick);

    return button;
  }

  /**
   * Create small button
   */
  private createSmallButton(
    text: string,
    x: number,
    y: number,
    onClick: () => void
  ): StageNode {
    const button = Stage.create().pin({
      x: x,
      y: y,
    });

    const bg = Stage.create()
      .pin({
        width: 60,
        height: 30,
      })
      .image('#006699');

    button.append(bg);

    const label = Stage.create()
      .pin({
        x: 30,
        y: 15,
        align: 0.5,
      })
      .image(this.createTextImage(text, 14, '#ffffff'));

    button.append(label);

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
   * Convert RGB to hex color
   */
  private rgbToHex(color: Color): string {
    const r = color.r.toString(16).padStart(2, '0');
    const g = color.g.toString(16).padStart(2, '0');
    const b = color.b.toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Close setup screen
   */
  close(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
