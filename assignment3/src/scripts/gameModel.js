


/**
 * Top-level class for the game model.
 * @param {othello.Board} initialBoard the initial board.
 * @param {othello.Piece} initialPiece the initial player to move.
 * @param {othello.BoardHistory} boardHistory the history logger.
 * @param {number} delayInterval the number of milliseconds to delay
 *     notifying AI Players.
 * @constructor
 * @implements {othello.Observable}
 * @const
 */
othello.GameModel =
    function(initialBoard, initialPiece, boardHistory, delayInterval) {
  this.board = initialBoard;
  this.currentTurnPlayer = initialPiece;
  /** @const */ this.boardHistory = boardHistory;
  /** @const */ this.delayInterval = delayInterval;
  /** @const */ this.observers = [];
  this.lastPlayerPassed = false;
  this.gameState = othello.GameModel.State.progressing;
  this.latestMove = othello.utils.None.instance;
};


/**
 * The possible states of the game
 * @enum {string}
 * @const
 */
othello.GameModel.State = {
  progressing: 'progressing',
  rewritingHistory: 'rewritingHistory',
  finished: 'finished'
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
  this.gameState = othello.GameModel.State.finished;
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
  if (this.gameState === othello.GameModel.State.finished ||
      this.gameState === othello.GameModel.State.rewritingHistory) {
    return;
  }

  if (this.board.isFull()) {
    // Game over
    this.publishFinalMessage();
    return;
  }

  /** @const */ var nextBoard = /** @type {othello.Board} */
      (move.getOrElse(null));
  if (!nextBoard) {
    if (this.lastPlayerPassed) {
      // two passes in a row; the game has ended
      this.publishFinalMessage();
      return;
    } else {
      this.lastPlayerPassed = true;
    }
  } else {
    this.lastPlayerPassed = false;
    this.board = nextBoard;
  }
  this.boardHistory.push(this.board);

  // if no move made, just reuse the old board.
  this.currentTurnPlayer = this.currentTurnPlayer.flip();
  this.notifyObservers();
};


/**
 *  Reports whether the state is rewritingHistory
 *  @return {boolean} true if we are rewritingHistory.
 *  @const
 */
othello.GameModel.prototype.isRewritingHistory = function() {
  return this.gameState === othello.GameModel.State.rewritingHistory;
};


/**
 * Reports whether we can make an undo..
 * @return {boolean} true if an undo is possible.
 * @const
 */
othello.GameModel.prototype.canUndo = function() {
  return this.boardHistory.canUndo();
};


/**
* Undo moves
* @const
*/
othello.GameModel.prototype.undo = function() {
  if (!this.canUndo()) {
    // The controller should block this beforehand
    throw new Error('Called undo when not able to undo');
  }

  this.gameState = othello.GameModel.State.rewritingHistory;
  this.board = this.boardHistory.undo();
  this.currentTurnPlayer = this.currentTurnPlayer.flip();
  this.notifyObservers();
};


/**
 * Resume after done undoing/redoing
 * @const
 */
othello.GameModel.prototype.resumeGame = function() {
  if (this.gameState !== othello.GameModel.State.rewritingHistory) {
    throw new Error('Should only resume if undoing');
  }
  this.gameState = othello.GameModel.State.progressing;
};


/**
 * Report if capable of redoing
 * @return {boolean} if we can redo.
 * @const
 */
othello.GameModel.prototype.canRedo = function() {
  return this.boardHistory.canRedo();
};


/**
 * Redo a move
 * @const
 */
othello.GameModel.prototype.redo = function() {
  if (!this.canRedo()) {
    throw new Error('Called redo when not able to redo');
  }

  this.board = this.boardHistory.redo();
  this.currentTurnPlayer = this.currentTurnPlayer.flip();
  this.notifyObservers();
};
