


/**
 * Top-level class for the game model.
 * @param {othello.Board} initialBoard the initial board.
 * @param {othello.Piece} initialPiece the initial player to move.
 * @constructor
 * @implements {othello.Observable}
 * @const
 */
othello.GameModel = function(initialBoard, initialPiece, opt_delayInterval) {
  this.board = initialBoard;
  this.currentTurnPlayer = initialPiece;
  this.delayInterval = 0; 
  /** @const */ this.observers = [];
};


/**
 * Set the optional delay interval parameter. This should be set to some
 * nonzero value if playing an AI vs. AI game.
 * @const
 */
othello.GameModel.prototype.setDelayInterval = function(delayInterval) {
  this.delayInterval = delayInterval;
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
 * Take one player's step through the game.
 * @param {othello.utils.Option} move the move being made, or None for a pass.
 *     The Option wrapps an othello.Board.
 * @const
 */
othello.GameModel.prototype.step = function(move) {
  this.board = move.getOrElse(this.board);
  // if no move made, just reuse the old board.
  this.currentTurnPlayer = this.currentTurnPlayer.flip();
  /** @const */ var self = this;
  window.setTimeout(function() {
    self.notifyObservers();
  }, this.delayInterval);
};
