


/**
 * Top-level class for the game model.
 * @param {othello.Board} initialBoard the initial board.
 * @param {othello.Piece} initialPiece the initial player to move.
 * @param {number} delayInterval the number of milliseconds to delay.
 * @constructor
 * @implements {othello.Observable}
 * @const
 */
othello.GameModel = function(initialBoard, initialPiece, delayInterval) {
  this.board = initialBoard;
  this.currentTurnPlayer = initialPiece;
  /** @const */ this.delayInterval = delayInterval;
  /** @const */ this.observers = [];
  this.lastPlayerPassed = false;
  this.gameIsOver = false;
};


/**
 * Convenience method that tells if a player can move
 * @param {othello.Piece} piece the Piece for the player trying to move.
 * @return {boolean} true if that player has moves.
 */
othello.GameModel.prototype.canMove = function(piece) {
  return this.board.canMove(piece);
};


/**
 * Given a proposed player, row, and column, reports whether the move
 * is valid.
 * @param {othello.Piece} piece the side moving.
 * @param {number} row the row.
 * @param {number} column the column.
 * @return {boolean} true if the placement is valid.
 */
othello.GameModel.prototype.moveIsValid = function(piece, row, column) {
  return this.board.placementIsValid(piece, row, column);
};


/**
 * Given a piece, row, and column, makes the move. Forwards the call
 * on to this.board.
 * @param {othello.Piece} piece the side moving.
 * @param {number} row the row.
 * @param {number} column the column.
 * @return {othello.Board} the resulting board.
 */
othello.GameModel.prototype.makeMove = function(piece, row, column) {
  return this.board.makeMove(piece, row, column);
};


/**
 * Getter for currentTurnPlayer
 * @return {othello.Piece} the currentTurnPlayer.
 * @const
 */
othello.GameModel.prototype.getCurrentTurnPlayer = function() {
  return this.currentTurnPlayer;
};


/**
 * Add an observer
 * @param {othello.Observer} observer the observer to add.
 * @const
 */
othello.GameModel.prototype.addObserver = function(observer) {
  this.observers.push(observer);
};


/**
 * Let the observers know the state has changed
 * @const
 */
othello.GameModel.prototype.notifyObservers = function() {
  /** @const */ var self = this;
  _(this.observers).each(function(observer) {
    /** @const */ var delay = observer instanceof othello.AiPlayer ?
        self.delayInterval : 0;
    window.setTimeout(function() {
      observer.onModelChange(self.board, self.currentTurnPlayer);
    }, delay);
  });
};


/**
 * Publish the first message.
 * @const
 */
othello.GameModel.prototype.publishInitialMessage = function() {
  /** @const */ var self = this;
  _(this.observers).each(function(observer) {
    observer.onInitialMessage(self.board, self.currentTurnPlayer);
  });
};


/**
 * Publish the final message.
 * @const
 */
othello.GameModel.prototype.publishFinalMessage = function() {
  this.gameIsOver = true;
  /** @const */ var self = this;
  _(this.observers).each(function(observer) {
    observer.onGameEnd(self.board, self.currentTurnPlayer);
  });
};


/**
 * Take one player's step through the game.
 * @param {othello.utils.Option} move the move being made, or None for a pass.
 *     The Option wraps an othello.Board.
 * @const
 */
othello.GameModel.prototype.step = function(move) {
  console.log("in step");
  if (this.gameIsOver) {
    return; 
  }

  if (this.board.isFull()) {
    // Game over
    this.publishFinalMessage();
    return;
  }

  /** @const */ var nextBoard = move.getOrElse(null);
  if (!nextBoard) {
    if (lastPlayerPassed) {
      // two passes in a row; the game has ended 
      this.publishFinalMessage();
      return;
    } else {
      lastPlayerPassed = true; 
    }
  } else {
    lastPlayerPassed = false; 
    this.board = nextBoard;
  }

  // if no move made, just reuse the old board.
  this.currentTurnPlayer = this.currentTurnPlayer.flip();
  /** @const */ var self = this;
  _.defer(function() {
    self.notifyObservers(); 
  }, this.delayInterval);
};
