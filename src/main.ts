/**
 * Main entry point for Tanks-a-Lot game
 */

import { Game } from './game/core/game';

/**
 * Initialize and start the game
 */
function init(): void {
  const appElement = document.getElementById('app');

  if (!appElement) {
    throw new Error('App element not found');
  }

  // Create and start the game
  const game = new Game(appElement);
  game.start();
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
