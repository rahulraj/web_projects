/**
 * Top-level class for the game model.
 * @param {othello.Board} initialBoard the initial board.
 * @param {othello.Piece} initialPiece the initial player to move.
 * @constructor
 * @implements {othello.Observable}
 * @const
 */
othello.GameModel = function(initialBoard, initialPiece) {
  this.board = initialBoard;
  this.currentTurnPlayer = initialPiece;
};

othello.GameModel.prototype.addObserver = function(observer) {
  this.observers.push(observer);
};

othello.GameModel.prototype.notifyObservers = function() {
  /** @const */ var self = this;
  _(this.observers).each(function(observer) {
    observer.onModelChange(self.board, self.currentTurnPlayer);
  });
};

/**
 * Take one player's step through the game.
 * @param {othello.utils.Option} move the move being made, or None for a pass.
 * @const
 */
othello.GameModel.step = function(move) {
  /** @const */ var moveMade = move.getOrElse(null);
  if (moveMade) {
    this.board = this.board.makeMove(move.getX(), move.getY());
  }
  // if no move made, just reuse the old board.
  this.currentTurnPlayer = this.currentTurnPlayer.flip();
  this.notifyObservers();
};
