/**
 * Main menu screen
 */

import Stage from 'stage-js';

export class MainMenu {
  private stage: Stage;
  private onStartGame: () => void;

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
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === ' ' || e.key === 'Enter') {
        window.removeEventListener('keydown', handleKeyPress);
        this.onStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Hide the main menu
   */
  hide(): void {
    this.stage.empty();
  }
}
