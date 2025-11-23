/**
 * Main menu screen
 */

import Stage from 'stage-js';

export class MainMenu {
  private stage: Stage;
  private onStartGame: () => void;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(stage: Stage, onStartGame: () => void) {
    this.stage = stage;
    this.onStartGame = onStartGame;
  }

  /**
   * Show the main menu
   */
  show(): void {
    this.stage.empty();

    // Title
    const title = Stage.string('TANKS-A-LOT');
    const titleSprite = Stage.create().pin({
      x: 400,
      y: 150,
      align: 0.5,
    });
    titleSprite.image(title);

    // Start button
    const startText = Stage.string('Press SPACE to Start');
    const startButton = Stage.create().pin({
      x: 400,
      y: 300,
      align: 0.5,
    });
    startButton.image(startText);

    // Instructions
    const instructions = Stage.string(
      'Arrow Keys: Aim | Space: Fire | Q/E: Move | Tab: Change Weapon'
    );
    const instructionsSprite = Stage.create().pin({
      x: 400,
      y: 400,
      align: 0.5,
    });
    instructionsSprite.image(instructions);

    this.stage.append(titleSprite);
    this.stage.append(startButton);
    this.stage.append(instructionsSprite);

    // Handle space key to start game
    this.keyHandler = (e: KeyboardEvent): void => {
      if (e.key === ' ' || e.key === 'Enter') {
        this.cleanup();
        this.onStartGame();
      }
    };

    window.addEventListener('keydown', this.keyHandler);
  }

  /**
   * Hide the main menu
   */
  hide(): void {
    this.cleanup();
    this.stage.empty();
  }

  /**
   * Cleanup event listeners
   */
  private cleanup(): void {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
}
