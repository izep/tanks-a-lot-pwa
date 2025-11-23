/**
 * Main game class with Stage.js integration
 */

import Stage from 'stage-js';
import { GameConfig, PlayerConfig, PlayerType, WeaponType } from '@/types/game';
import { GameStateManager } from '@/game/state/game-state';
import { createProjectile, updateProjectile } from '@/game/physics/ballistics';
import { checkCollisions, calculateDamage } from '@/game/physics/collision';
import { getWeaponConfig } from '@/game/weapons/weapon-config';
import { InputManager, InputAction } from './input';
import { MainMenu } from '@/ui/screens/main-menu';
import { GameHUD } from '@/ui/hud/game-hud';
import { GameOver } from '@/ui/screens/game-over';

enum GamePhase {
  Menu = 'menu',
  Playing = 'playing',
  GameOver = 'gameover',
}

export class Game {
  private stage: Stage | null = null;
  private gameState: GameStateManager | null = null;
  private container: HTMLElement;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private readonly targetFPS = 60;
  private readonly deltaTime = 1000 / this.targetFPS;
  private inputManager: InputManager | null = null;
  private mainMenu: MainMenu | null = null;
  private gameHUD: GameHUD | null = null;
  private gameOver: GameOver | null = null;
  private currentPhase: GamePhase = GamePhase.Menu;
  private projectilesActive = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Initialize and start the game
   */
  start(): void {
    this.setupStage();
    this.setupInput();
    this.showMainMenu();
    this.startGameLoop();
  }

  /**
   * Setup Stage.js rendering
   */
  private setupStage(): void {
    // Create Stage.js instance
    this.stage = Stage.mount(this.container, {
      width: 800,
      height: 600,
      scaleMode: 'fit',
      align: 0.5,
    });

    // Set background color (sky blue)
    this.stage.background('#87CEEB');
  }

  /**
   * Setup input handling
   */
  private setupInput(): void {
    this.inputManager = new InputManager();

    // Bind input actions
    this.inputManager.on(InputAction.AngleIncrease, () => this.adjustAngle(1));
    this.inputManager.on(InputAction.AngleDecrease, () => this.adjustAngle(-1));
    this.inputManager.on(InputAction.PowerIncrease, () => this.adjustPower(1));
    this.inputManager.on(InputAction.PowerDecrease, () => this.adjustPower(-1));
    this.inputManager.on(InputAction.Fire, () => this.handleFire());
    this.inputManager.on(InputAction.MoveLeft, () => this.handleMove(-1));
    this.inputManager.on(InputAction.MoveRight, () => this.handleMove(1));
    this.inputManager.on(InputAction.NextWeapon, () => this.cycleWeapon(1));
    this.inputManager.on(InputAction.PrevWeapon, () => this.cycleWeapon(-1));
  }

  /**
   * Cycle through available weapons
   */
  private cycleWeapon(direction: number): void {
    if (!this.gameState || this.currentPhase !== GamePhase.Playing || this.projectilesActive) return;

    const currentPlayer = this.gameState.getCurrentPlayer();
    const availableWeapons = Object.keys(currentPlayer.inventory).filter(
      weaponType => currentPlayer.inventory[weaponType] > 0
    ) as WeaponType[];

    if (availableWeapons.length === 0) return;

    // Store current weapon in player state (we'll add this to player state)
    const currentWeapon = this.getCurrentWeapon();
    const currentIndex = availableWeapons.indexOf(currentWeapon);
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = availableWeapons.length - 1;
    if (newIndex >= availableWeapons.length) newIndex = 0;

    this.setCurrentWeapon(availableWeapons[newIndex]);
  }

  private currentWeapon: WeaponType = WeaponType.BabyMissile;

  private getCurrentWeapon(): WeaponType {
    return this.currentWeapon;
  }

  private setCurrentWeapon(weapon: WeaponType): void {
    this.currentWeapon = weapon;
  }

  /**
   * Show main menu
   */
  private showMainMenu(): void {
    if (!this.stage) return;

    this.currentPhase = GamePhase.Menu;
    this.mainMenu = new MainMenu(this.stage, () => this.startNewGame());
    this.mainMenu.show();
  }

  /**
   * Start a new game
   */
  private startNewGame(): void {
    this.initializeGame();
    this.currentPhase = GamePhase.Playing;
    
    if (this.stage) {
      this.gameHUD = new GameHUD(this.stage);
    }
  }

  /**
   * Initialize game state
   */
  private initializeGame(): void {
    // Create default game configuration
    const config: GameConfig = {
      rounds: 3,
      playerCount: 2,
      physics: {
        gravity: 0.5,
        windMin: -2,
        windMax: 2,
        windChangeRate: 0.1,
        maxPower: 100,
        minPower: 0,
        projectileSpeed: 1,
      },
      economics: {
        startingMoney: 10000,
        interestRate: 0.1,
        marketVolatility: 0.2,
      },
      terrainSeed: Math.floor(Math.random() * 10000),
      terrainRoughness: 0.7,
      terrainHeight: 0.6,
    };

    // Create default players
    const players: PlayerConfig[] = [
      {
        id: 'player1',
        name: 'Player 1',
        type: PlayerType.Human,
        color: { r: 255, g: 0, b: 0 },
      },
      {
        id: 'player2',
        name: 'Player 2',
        type: PlayerType.Human,
        color: { r: 0, g: 0, b: 255 },
      },
    ];

    this.gameState = new GameStateManager(config, players);
    this.gameState.initializeRound(800, 600);
    this.projectilesActive = false;
  }

  /**
   * Adjust firing angle
   */
  private adjustAngle(delta: number): void {
    if (!this.gameState || this.currentPhase !== GamePhase.Playing || this.projectilesActive) return;

    const currentPlayer = this.gameState.getCurrentPlayer();
    const tank = this.gameState.getTank(currentPlayer.config.id);
    if (tank) {
      const currentAngle = tank.getState().angle;
      tank.setAngle(currentAngle + delta);
    }
  }

  /**
   * Adjust firing power
   */
  private adjustPower(delta: number): void {
    if (!this.gameState || this.currentPhase !== GamePhase.Playing || this.projectilesActive) return;

    const currentPlayer = this.gameState.getCurrentPlayer();
    const tank = this.gameState.getTank(currentPlayer.config.id);
    if (tank) {
      const currentPower = tank.getState().power;
      tank.setPower(currentPower + delta);
    }
  }

  /**
   * Handle firing
   */
  private handleFire(): void {
    if (!this.gameState || this.currentPhase !== GamePhase.Playing || this.projectilesActive) return;

    const state = this.gameState.getState();
    if (state.projectiles.length > 0) return; // Already firing

    const currentPlayer = this.gameState.getCurrentPlayer();
    const weapon = this.getCurrentWeapon();

    // Check if player has this weapon
    if (!currentPlayer.inventory[weapon] || currentPlayer.inventory[weapon] <= 0) {
      return; // No ammo
    }

    // Consume ammo
    currentPlayer.inventory[weapon]--;

    // Fire with selected weapon
    this.fire(weapon);
    this.projectilesActive = true;
  }

  /**
   * Handle tank movement
   */
  private handleMove(direction: -1 | 1): void {
    if (!this.gameState || this.currentPhase !== GamePhase.Playing || this.projectilesActive) return;

    const currentPlayer = this.gameState.getCurrentPlayer();
    const tank = this.gameState.getTank(currentPlayer.config.id);
    const terrain = this.gameState.getTerrain();

    if (tank && terrain) {
      tank.move(direction, 5, terrain);
    }
  }

  /**
   * Main game loop
   */
  private startGameLoop(): void {
    const loop = (currentTime: number): void => {
      const elapsed = currentTime - this.lastTime;

      if (elapsed >= this.deltaTime) {
        this.lastTime = currentTime - (elapsed % this.deltaTime);
        
        if (this.currentPhase === GamePhase.Playing) {
          this.update(this.deltaTime / 1000); // Convert to seconds
          this.render();
          this.checkGameOver();
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Update game state
   */
  private update(dt: number): void {
    if (!this.gameState) return;

    const state = this.gameState.getState();
    const terrain = this.gameState.getTerrain();
    if (!terrain) return;

    // Update projectiles
    const updatedProjectiles = state.projectiles
      .map((projectile) => {
        if (!projectile.active) return projectile;

        // Update physics
        const updated = updateProjectile(projectile, {
          gravity: state.config.physics.gravity,
          wind: state.wind,
          deltaTime: dt,
        });

        // Check collisions
        const collision = checkCollisions(
          updated,
          terrain,
          state.players.map((p) => p.tank)
        );

        if (collision.type !== 'none') {
          // Handle collision
          updated.active = false;

          if (collision.type === 'terrain' || collision.type === 'tank') {
            this.handleExplosion(updated.weaponType, collision.position, updated.ownerId);
          }
        }

        return updated;
      })
      .filter((p) => p.active);

    // Update projectiles through proper state management
    this.gameState.updateProjectiles(updatedProjectiles);

    // If all projectiles are done, end turn
    if (this.projectilesActive && updatedProjectiles.length === 0) {
      this.endTurn();
    }
  }

  /**
   * End current turn
   */
  private endTurn(): void {
    if (!this.gameState) return;

    this.projectilesActive = false;
    this.gameState.nextTurn();
  }

  /**
   * Check if game is over
   */
  private checkGameOver(): void {
    if (!this.gameState) return;

    if (this.gameState.isGameOver()) {
      this.showGameOver();
    }
  }

  /**
   * Show game over screen
   */
  private showGameOver(): void {
    if (!this.stage || !this.gameState) return;

    const state = this.gameState.getState();
    this.currentPhase = GamePhase.GameOver;

    // Find winner
    let winner = state.players[0];
    for (const player of state.players) {
      if (player.score > winner.score) {
        winner = player;
      }
    }

    this.gameOver = new GameOver(this.stage, () => this.showMainMenu());
    this.gameOver.show(winner.config.name, winner.score);
  }

  /**
   * Handle explosion effects
   */
  private handleExplosion(
    weaponType: WeaponType,
    position: { x: number; y: number },
    ownerId: string
  ): void {
    if (!this.gameState) return;

    const terrain = this.gameState.getTerrain();
    if (!terrain) return;

    const weaponConfig = getWeaponConfig(weaponType);
    const state = this.gameState.getState();

    // Visual explosion effect
    this.renderExplosion(position, weaponConfig.blastRadius);

    // Destroy terrain
    terrain.explode(position, weaponConfig.blastRadius);

    // Damage tanks in blast radius
    state.players.forEach((player) => {
      const tank = this.gameState!.getTank(player.config.id);
      if (!tank) return;

      const tankState = tank.getState();
      if (!tankState.isAlive) return;

      const damage = calculateDamage(
        tankState.position,
        position,
        weaponConfig.damage,
        weaponConfig.blastRadius
      );

      if (damage > 0) {
        tank.takeDamage(damage);

        // Award money for damage
        if (ownerId !== player.config.id) {
          const damageDealer = state.players.find((p) => p.config.id === ownerId);
          if (damageDealer) {
            damageDealer.money += damage * 10; // 10x multiplier for money
            damageDealer.score += damage;
          }
        }

        // Check if tank was killed
        if (!tank.getState().isAlive) {
          this.gameState!.recordKill(ownerId, player.config.id);
        }
      }

      // Update tank position (check for falling)
      tank.updatePosition(terrain);
    });
  }

  /**
   * Render explosion visual effect
   */
  private renderExplosion(position: { x: number; y: number }, radius: number): void {
    if (!this.stage) return;

    // Create explosion circles with fading effect
    const colors = ['#FFFF00', '#FF8800', '#FF0000'];
    
    colors.forEach((color, index) => {
      const explosionRadius = radius * (1 - index * 0.3);
      const explosion = Stage.create().pin({
        x: position.x,
        y: position.y,
        width: explosionRadius * 2,
        height: explosionRadius * 2,
        align: 0.5,
        alpha: 0.7 - index * 0.2,
      });
      
      // Create a simple circle by using a rounded square
      explosion.image(color);
      if (this.stage) {
        this.stage.append(explosion);
      }
    });
  }

  /**
   * Render current game state
   */
  private render(): void {
    if (!this.stage || !this.gameState || this.currentPhase !== GamePhase.Playing) return;

    // Clear stage
    this.stage.empty();

    const state = this.gameState.getState();
    const terrain = this.gameState.getTerrain();

    // Render terrain
    if (terrain) {
      this.renderTerrain(terrain);
    }

    // Render tanks
    state.players.forEach((player) => {
      if (player.tank.isAlive) {
        this.renderTank(player.tank);
      }
    });

    // Render projectiles
    state.projectiles.forEach((projectile) => {
      if (projectile.active) {
        this.renderProjectile(projectile);
      }
    });

    // Render HUD
    if (this.gameHUD) {
      this.gameHUD.update(state, this.getCurrentWeapon());
    }
  }

  /**
   * Render terrain using efficient batched rendering
   */
  private renderTerrain(terrain: ReturnType<typeof GameStateManager.prototype.getTerrain>): void {
    if (!this.stage || !terrain) return;

    const { width, height } = terrain.getDimensions();
    const bitmap = terrain.getBitmap();

    // Create a canvas texture for efficient rendering
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Draw terrain pixels to canvas
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (bitmap[index] === 1) {
          const pixelIndex = (y * width + x) * 4;
          // Brown terrain color
          data[pixelIndex] = 139;     // R
          data[pixelIndex + 1] = 69;  // G
          data[pixelIndex + 2] = 19;  // B
          data[pixelIndex + 3] = 255; // A
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Create a single Stage.js sprite from the canvas
    const terrainSprite = Stage.create().pin({
      x: 0,
      y: 0,
    });
    
    terrainSprite.image(canvas);
    this.stage.append(terrainSprite);
  }

  /**
   * Render tank with barrel
   */
  private renderTank(tank: ReturnType<typeof GameStateManager.prototype.getCurrentPlayer>['tank']): void {
    if (!this.stage || !this.gameState) return;

    const state = this.gameState.getState();
    const player = state.players.find(p => p.tank.id === tank.id);
    if (!player) return;

    // Get color
    const color = `rgb(${player.config.color.r}, ${player.config.color.g}, ${player.config.color.b})`;

    // Tank body
    const tankBody = Stage.create().pin({
      x: tank.position.x,
      y: tank.position.y,
      width: 20,
      height: 10,
      align: 0.5,
    });
    tankBody.image(color);
    
    // Tank barrel
    const angleRad = (tank.angle * Math.PI) / 180;
    const barrelLength = 15;
    
    // Create barrel using a thin rectangle
    const barrel = Stage.create().pin({
      x: tank.position.x,
      y: tank.position.y,
      width: barrelLength,
      height: 3,
      align: 0,
      alignY: 0.5,
      rotation: -angleRad, // Negative because Stage.js rotation is opposite
    });
    barrel.image(color);
    
    // Health bar above tank
    const healthBarWidth = 20;
    const healthPercent = tank.health / tank.maxHealth;
    const healthBarFill = healthBarWidth * healthPercent;
    
    const healthBarBg = Stage.create().pin({
      x: tank.position.x - healthBarWidth / 2,
      y: tank.position.y - 20,
      width: healthBarWidth,
      height: 3,
    });
    healthBarBg.image('#333333');
    
    const healthBarColor = healthPercent > 0.5 ? '#00FF00' : healthPercent > 0.25 ? '#FFFF00' : '#FF0000';
    const healthBar = Stage.create().pin({
      x: tank.position.x - healthBarWidth / 2,
      y: tank.position.y - 20,
      width: healthBarFill,
      height: 3,
    });
    healthBar.image(healthBarColor);
    
    this.stage.append(tankBody);
    this.stage.append(barrel);
    this.stage.append(healthBarBg);
    this.stage.append(healthBar);
  }

  /**
   * Render projectile
   */
  private renderProjectile(projectile: ReturnType<typeof createProjectile>): void {
    if (!this.stage) return;

    const sprite = Stage.create().pin({
      x: projectile.position.x,
      y: projectile.position.y,
      width: 4,
      height: 4,
      align: 0.5,
      rotation: projectile.angle,
    });

    sprite.image('#FFFF00'); // Yellow
    
    this.stage.append(sprite);
  }

  /**
   * Fire weapon
   */
  fire(weaponType: WeaponType): void {
    if (!this.gameState) return;

    const currentPlayer = this.gameState.getCurrentPlayer();
    const tank = this.gameState.getTank(currentPlayer.config.id);
    
    if (!tank) return;

    const tankState = tank.getState();
    const barrelTip = tank.getBarrelTip();

    // Create projectile
    const projectile = createProjectile(
      `proj-${Date.now()}`,
      weaponType,
      barrelTip,
      tankState.angle,
      tankState.power,
      currentPlayer.config.id
    );

    // Add to state through proper method
    this.gameState.addProjectile(projectile);
  }

  /**
   * Stop the game
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.inputManager) {
      this.inputManager.destroy();
    }
  }
}
