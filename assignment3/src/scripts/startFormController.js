othello.StartFormController = function(startForm) {
  /** @const */ this.startForm = startForm;
};


othello.StartFormController.prototype.onPlayButtonClicked = function() {
  /** @const */ var whitePlayer = this.startForm.whitePlayerSelection();
  /** @const */ var blackPlayer = this.startForm.blackPlayerSelection();
  if (!blackPlayer || !whitePlayer) {
    alert('You need to select players!');
    return;  
  }
  console.log('blackPlayer: ' + blackPlayer + '\nwhitePlayer: ' + whitePlayer);
  
  // Start the main game.
  othello.GameFactory.createGameMvcAndRun(whitePlayer, blackPlayer);
};
