/**
 * Game over screen
 */

import Stage from 'stage-js';

export class GameOver {
  private stage: Stage;
  private onRestart: () => void;

  constructor(stage: Stage, onRestart: () => void) {
    this.stage = stage;
    this.onRestart = onRestart;
  }

  /**
   * Show game over screen
   */
  show(winnerName: string, winnerScore: number): void {
    this.stage.empty();

    // Title
    const title = Stage.string('GAME OVER');
    const titleSprite = Stage.create().pin({
      x: 400,
      y: 150,
      align: 0.5,
    });
    titleSprite.image(title);

    // Winner
    const winnerText = Stage.string(`Winner: ${winnerName}`);
    const winnerSprite = Stage.create().pin({
      x: 400,
      y: 250,
      align: 0.5,
    });
    winnerSprite.image(winnerText);

    // Score
    const scoreText = Stage.string(`Score: ${winnerScore}`);
    const scoreSprite = Stage.create().pin({
      x: 400,
      y: 300,
      align: 0.5,
    });
    scoreSprite.image(scoreText);

    // Restart prompt
    const restartText = Stage.string('Press SPACE to Play Again');
    const restartSprite = Stage.create().pin({
      x: 400,
      y: 400,
      align: 0.5,
    });
    restartSprite.image(restartText);

    this.stage.append(titleSprite);
    this.stage.append(winnerSprite);
    this.stage.append(scoreSprite);
    this.stage.append(restartSprite);

    // Handle restart
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === ' ' || e.key === 'Enter') {
        window.removeEventListener('keydown', handleKeyPress);
        this.onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Hide game over screen
   */
  hide(): void {
    this.stage.empty();
  }
}
