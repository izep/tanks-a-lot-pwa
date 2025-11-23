/**
 * Core type definitions for the Tanks-a-Lot game
 */

/**
 * 2D Vector for positions, velocities, etc.
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Color representation
 */
export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Player types
 */
export enum PlayerType {
  Human = 'human',
  AI = 'ai',
}

/**
 * AI difficulty levels
 */
export enum AIDifficulty {
  Moron = 'moron',
  Shooter = 'shooter',
  Tosser = 'tosser',
  Cyborg = 'cyborg',
  Poolshark = 'poolshark',
  Chooser = 'chooser',
  Spoiler = 'spoiler',
  Unknown = 'unknown',
}

/**
 * Player configuration
 */
export interface PlayerConfig {
  id: string;
  name: string;
  type: PlayerType;
  aiDifficulty?: AIDifficulty;
  color: Color;
  team?: number;
}

/**
 * Tank state
 */
export interface TankState {
  id: string;
  playerId: string;
  position: Vector2D;
  health: number;
  maxHealth: number;
  angle: number;
  power: number;
  fuel: number;
  shield: number;
  isAlive: boolean;
}

/**
 * Weapon types
 */
export enum WeaponType {
  // Standard explosives
  BabyMissile = 'baby-missile',
  Missile = 'missile',
  BabyNuke = 'baby-nuke',
  Nuke = 'nuke',

  // Multi-warhead
  MIRV = 'mirv',
  DeathsHead = 'deaths-head',

  // Rolling
  BabyRoller = 'baby-roller',
  Roller = 'roller',
  HeavyRoller = 'heavy-roller',

  // Tunneling
  BabyDigger = 'baby-digger',
  Digger = 'digger',
  HeavyDigger = 'heavy-digger',
  BabySandhog = 'baby-sandhog',
  Sandhog = 'sandhog',
  HeavySandhog = 'heavy-sandhog',

  // Terrain modification
  RiotCharge = 'riot-charge',
  RiotBlast = 'riot-blast',
  RiotBomb = 'riot-bomb',
  HeavyRiotBomb = 'heavy-riot-bomb',
  DirtClod = 'dirt-clod',
  DirtBall = 'dirt-ball',
  TonOfDirt = 'ton-of-dirt',
  LiquidDirt = 'liquid-dirt',
  DirtCharge = 'dirt-charge',
  EarthDisrupter = 'earth-disrupter',

  // Special
  Napalm = 'napalm',
  HotNapalm = 'hot-napalm',
  LeapFrog = 'leap-frog',
  FunkyBomb = 'funky-bomb',
  PlasmaBlast = 'plasma-blast',
  Laser = 'laser',

  // Utility
  Tracer = 'tracer',
  SmokeTracer = 'smoke-tracer',
}

/**
 * Weapon properties
 */
export interface WeaponConfig {
  type: WeaponType;
  name: string;
  cost: number;
  bundleSize: number;
  blastRadius: number;
  damage: number;
  description: string;
}

/**
 * Projectile state
 */
export interface ProjectileState {
  id: string;
  weaponType: WeaponType;
  position: Vector2D;
  velocity: Vector2D;
  angle: number;
  ownerId: string;
  active: boolean;
}

/**
 * Game physics configuration
 */
export interface PhysicsConfig {
  gravity: number;
  windMin: number;
  windMax: number;
  windChangeRate: number;
  maxPower: number;
  minPower: number;
  projectileSpeed: number;
}

/**
 * Economic configuration
 */
export interface EconomicConfig {
  startingMoney: number;
  interestRate: number;
  marketVolatility: number;
}

/**
 * Game configuration
 */
export interface GameConfig {
  rounds: number;
  playerCount: number;
  physics: PhysicsConfig;
  economics: EconomicConfig;
  terrainSeed?: number;
  terrainRoughness: number;
  terrainHeight: number;
}

/**
 * Player inventory
 */
export interface Inventory {
  [key: string]: number;
}

/**
 * Player state
 */
export interface PlayerState {
  config: PlayerConfig;
  tank: TankState;
  money: number;
  inventory: Inventory;
  score: number;
  kills: number;
  deaths: number;
}

/**
 * Game state
 */
export interface GameState {
  config: GameConfig;
  currentRound: number;
  currentPlayerIndex: number;
  players: PlayerState[];
  wind: number;
  terrain: Uint8Array | null;
  terrainWidth: number;
  terrainHeight: number;
  projectiles: ProjectileState[];
  gameOver: boolean;
  winner: string | null;
}

/**
 * Explosion effect
 */
export interface ExplosionEffect {
  position: Vector2D;
  radius: number;
  damage: number;
  createsDebris: boolean;
}
