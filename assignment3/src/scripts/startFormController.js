


/**
 * The controller for the start form. The "model" is in the DOM.
 * @param {othello.GameStartForm} startForm the start form.
 * @constructor
 * @const
 */
othello.StartFormController = function(startForm) {
  /** @const */ this.startForm = startForm;
};


/**
 * The function to call when the play button is clicked. Validates the
 * input, then starts the game.
 * @const
 */
othello.StartFormController.prototype.onPlayButtonClicked = function() {
  /** @const */ var whitePlayer = this.startForm.whitePlayerSelection();
  /** @const */ var blackPlayer = this.startForm.blackPlayerSelection();
  if (!blackPlayer || !whitePlayer) {
    alert('You need to select players!');
    return;
  }

  // Start the main game.
  othello.GameFactory.createGameMvcAndRun(whitePlayer, blackPlayer);
};
