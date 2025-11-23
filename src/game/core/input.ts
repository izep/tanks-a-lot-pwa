/**
 * Input handling system
 */

export enum InputAction {
  AngleIncrease = 'angle-increase',
  AngleDecrease = 'angle-decrease',
  PowerIncrease = 'power-increase',
  PowerDecrease = 'power-decrease',
  Fire = 'fire',
  MoveLeft = 'move-left',
  MoveRight = 'move-right',
  NextWeapon = 'next-weapon',
  PrevWeapon = 'prev-weapon',
  Menu = 'menu',
}

export type InputCallback = (action: InputAction) => void;

export class InputManager {
  private keyMap: Map<string, InputAction>;
  private callbacks: Map<InputAction, InputCallback[]>;
  private pressedKeys: Set<string>;

  constructor() {
    this.keyMap = new Map();
    this.callbacks = new Map();
    this.pressedKeys = new Set();

    this.setupDefaultKeyBindings();
    this.attachEventListeners();
  }

  /**
   * Setup default keyboard bindings
   */
  private setupDefaultKeyBindings(): void {
    // Angle controls
    this.keyMap.set('ArrowUp', InputAction.AngleIncrease);
    this.keyMap.set('w', InputAction.AngleIncrease);
    this.keyMap.set('ArrowDown', InputAction.AngleDecrease);
    this.keyMap.set('s', InputAction.AngleDecrease);

    // Power controls
    this.keyMap.set('ArrowRight', InputAction.PowerIncrease);
    this.keyMap.set('d', InputAction.PowerIncrease);
    this.keyMap.set('ArrowLeft', InputAction.PowerDecrease);
    this.keyMap.set('a', InputAction.PowerDecrease);

    // Fire
    this.keyMap.set(' ', InputAction.Fire);
    this.keyMap.set('Enter', InputAction.Fire);

    // Movement
    this.keyMap.set('q', InputAction.MoveLeft);
    this.keyMap.set('e', InputAction.MoveRight);

    // Weapon selection
    this.keyMap.set('Tab', InputAction.NextWeapon);
    this.keyMap.set('Shift', InputAction.PrevWeapon);

    // Menu
    this.keyMap.set('Escape', InputAction.Menu);
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Handle key down event
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    // Prevent default for game controls
    const action = this.keyMap.get(key);
    if (action) {
      event.preventDefault();
    }

    // Track pressed keys for continuous input
    if (!this.pressedKeys.has(key)) {
      this.pressedKeys.add(key);

      if (action) {
        this.triggerAction(action);
      }
    }
  }

  /**
   * Handle key up event
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key;
    this.pressedKeys.delete(key);
  }

  /**
   * Trigger an input action
   */
  private triggerAction(action: InputAction): void {
    const callbacks = this.callbacks.get(action);
    if (callbacks) {
      callbacks.forEach((callback) => callback(action));
    }
  }

  /**
   * Register callback for an action
   */
  on(action: InputAction, callback: InputCallback): void {
    if (!this.callbacks.has(action)) {
      this.callbacks.set(action, []);
    }
    this.callbacks.get(action)!.push(callback);
  }

  /**
   * Unregister callback for an action
   */
  off(action: InputAction, callback: InputCallback): void {
    const callbacks = this.callbacks.get(action);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(key: string): boolean {
    return this.pressedKeys.has(key);
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
