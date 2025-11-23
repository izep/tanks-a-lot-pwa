/**
 * Game state manager
 */

import {
  GameState,
  GameConfig,
  PlayerState,
  PlayerConfig,
  TankState,
  WeaponType,
  Inventory,
  ProjectileState,
} from '@/types/game';
import { Tank } from '@/game/entities/tank';
import { Terrain } from '@/game/entities/terrain';

export class GameStateManager {
  private state: GameState;
  private tanks: Map<string, Tank>;
  private terrain: Terrain | null;

  constructor(config: GameConfig, players: PlayerConfig[]) {
    this.tanks = new Map();
    this.terrain = null;

    this.state = {
      config,
      currentRound: 1,
      currentPlayerIndex: 0,
      players: players.map((playerConfig) => this.createPlayerState(playerConfig)),
      wind: this.generateWind(config.physics.windMin, config.physics.windMax),
      terrain: null,
      terrainWidth: 800,
      terrainHeight: 600,
      projectiles: [],
      gameOver: false,
      winner: null,
    };
  }

  /**
   * Create initial player state
   */
  private createPlayerState(config: PlayerConfig): PlayerState {
    const inventory: Inventory = {
      [WeaponType.BabyMissile]: 20,
      [WeaponType.Missile]: 10,
      [WeaponType.BabyNuke]: 3,
      [WeaponType.Nuke]: 1,
      [WeaponType.BabyRoller]: 5,
      [WeaponType.Tracer]: 10,
    };

    return {
      config,
      tank: {} as TankState, // Will be set when terrain is generated
      money: this.state?.config.economics.startingMoney || 5000,
      inventory,
      score: 0,
      kills: 0,
      deaths: 0,
    };
  }

  /**
   * Initialize game round with terrain and tank placement
   */
  initializeRound(width: number, height: number): void {
    // Generate terrain
    this.terrain = new Terrain(
      width,
      height,
      this.state.config.terrainSeed,
      this.state.config.terrainRoughness
    );

    this.state.terrainWidth = width;
    this.state.terrainHeight = height;
    this.state.terrain = this.terrain.getBitmap();

    // Place tanks on terrain
    this.placeTanks();

    // Reset projectiles
    this.state.projectiles = [];

    // Generate wind
    this.state.wind = this.generateWind(
      this.state.config.physics.windMin,
      this.state.config.physics.windMax
    );
  }

  /**
   * Place tanks evenly across terrain
   */
  private placeTanks(): void {
    if (!this.terrain) return;

    const playerCount = this.state.players.length;
    const { width } = this.terrain.getDimensions();
    const spacing = width / (playerCount + 1);

    this.state.players.forEach((player, index) => {
      const x = Math.floor(spacing * (index + 1));
      const y = this.terrain!.getHeightAt(x) - 5; // Place slightly above ground

      const tank = new Tank(player.config.id, player.config.id, { x, y });
      this.tanks.set(player.config.id, tank);
      player.tank = tank.getState();
    });
  }

  /**
   * Generate random wind
   */
  private generateWind(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Get terrain instance
   */
  getTerrain(): Terrain | null {
    return this.terrain;
  }

  /**
   * Get tank instance by player ID
   */
  getTank(playerId: string): Tank | undefined {
    return this.tanks.get(playerId);
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): PlayerState {
    return this.state.players[this.state.currentPlayerIndex];
  }

  /**
   * Advance to next player's turn
   */
  nextTurn(): void {
    // Move to next alive player
    const startIndex = this.state.currentPlayerIndex;
    
    do {
      this.state.currentPlayerIndex =
        (this.state.currentPlayerIndex + 1) % this.state.players.length;
    } while (
      !this.state.players[this.state.currentPlayerIndex].tank.isAlive &&
      this.state.currentPlayerIndex !== startIndex
    );

    // If we've cycled through all players, start new round
    if (this.state.currentPlayerIndex <= startIndex) {
      this.startNewRound();
    }
  }

  /**
   * Start a new round
   */
  private startNewRound(): void {
    this.state.currentRound++;

    if (this.state.currentRound > this.state.config.rounds) {
      this.endGame();
      return;
    }

    // Apply interest to money
    this.state.players.forEach((player) => {
      const interest = Math.floor(
        player.money * this.state.config.economics.interestRate
      );
      player.money += interest;
    });

    // Reset for new round (this would trigger shop phase in full implementation)
  }

  /**
   * End the game and determine winner
   */
  private endGame(): void {
    this.state.gameOver = true;

    // Find player with highest score
    let maxScore = -1;
    let winnerId: string | null = null;

    this.state.players.forEach((player) => {
      if (player.score > maxScore) {
        maxScore = player.score;
        winnerId = player.config.id;
      }
    });

    this.state.winner = winnerId;
  }

  /**
   * Update player score
   */
  updateScore(playerId: string, points: number): void {
    const player = this.state.players.find((p) => p.config.id === playerId);
    if (player) {
      player.score += points;
    }
  }

  /**
   * Record a kill
   */
  recordKill(killerId: string, victimId: string): void {
    const killer = this.state.players.find((p) => p.config.id === killerId);
    const victim = this.state.players.find((p) => p.config.id === victimId);

    if (killer) {
      killer.kills++;
      killer.score += 1000;
      killer.money += 500;
    }

    if (victim) {
      victim.deaths++;
    }
  }

  /**
   * Add projectile to game state
   */
  addProjectile(projectile: ProjectileState): void {
    this.state.projectiles.push(projectile);
  }

  /**
   * Update projectiles in game state
   */
  updateProjectiles(projectiles: ProjectileState[]): void {
    this.state.projectiles = projectiles;
  }

  /**
   * Check if game is over
   */
  isGameOver(): boolean {
    const alivePlayers = this.state.players.filter((p) => p.tank.isAlive);
    return alivePlayers.length <= 1 || this.state.gameOver;
  }
}
