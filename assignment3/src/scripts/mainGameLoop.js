


/**
 * Class that runs the main loop of the game, facilitating communication
 * betwen the players and the game state.
 * @param {othello.Player} whitePlayer the player with the white pieces.
 * @param {othello.Player} blackPlayer the player with the black pieces.
 * @param {function(othello.Board)} onGameFinish a function to call when the
 *     game ends, with the final Board as an argument.
 * @constructor
 * @const
 */
othello.MainGameLoop =
    function(whitePlayer, blackPlayer, onGameFinish) {
  /** @const */ this.whitePlayer = whitePlayer;
  /** @const */ this.blackPlayer = blackPlayer;
  this.onGameFinish = onGameFinish;
};


/**
 * Named constructor that creates a standard game (using Board's initialGame
 * and making the player with the black pieces go first).
 * @param {othello.Player} whitePlayer the player with the white pieces.
 * @param {othello.Player} blackPlayer the player with the black pieces.
 * @return {othello.MainGameLoop} a default main game loop.
 * @const
 */
//othello.MainGameLoop.createStandardMainGameLoop =
 //   function(whitePlayer, blackPlayer) {
  //return new othello.MainGameLoop(othello.Board.Builder.initialGame().build(),
   //   whitePlayer, blackPlayer, blackPlayer);
//};

/** @const */ othello.MainGameLoop.delayInterval = 500;


/**
 * Run the main game loop. Note that this function is asynchronous.
 * Calls this.onGameFinish when the game is over.
 * @param {othello.Board} board the current board.
 * @param {othello.Player} currentTurnPlayer the player whose turn it is.
 * @const
 */
othello.MainGameLoop.prototype.run = function(board, currentTurnPlayer) {
  if (!(board.canMove(this.whitePlayer.getPiece())) && 
      !(board.canMove(this.blackPlayer.getPiece()))) {
    this.onGameFinish(board);
  } else if (!(currentTurnPlayer.readyToMove())) {
    // It's a human's turn, but they still need more time.
    // Yield control to allow them to send input.
    /** @const */ var self = this;
    window.setTimeout(function() {
      self.run(board, currentTurnPlayer); 
    }, othello.MainGameLoop.delayInterval);
    return;
  } else {
    // Run a turn, then recurse asynchronously.  
    // if they pass, nextBoard is the same as board.
    // TODO Push boards onto an undo stack.
    // TODO Figure out how to disable this loop while the user is rewinding.
    /** @const */ var nextBoard = currentTurnPlayer.makeMove(board).
        getOrElse(othello.Board.Builder.templatedBy(board).build());
    /** @const */ var nextPlayer = currentTurnPlayer === this.whitePlayer ?
        this.blackPlayer : this.whitePlayer;
    /** @const */ var self = this;
    window.setTimeout(function() {
      self.run(nextBoard, nextPlayer);
    }, 0)
  }
};
