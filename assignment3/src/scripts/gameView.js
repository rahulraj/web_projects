


/**
 * Top-level view class for the main game.
 * @param {othello.BoardTableView} boardView the view for the board. Can
 *     mutate as the game changes.
 * @param {jQueryObject} undoButton the button to undo, wrapped in jQuery.
 * @param {jQueryObject} parentElement the parent for this view.
 * @constructor
 * @implements {othello.Observer}
 * @const
 */
othello.GameView = function(boardView, undoButton, parentElement) {
  this.boardView = boardView;
  /** @const */ this.undoButton = undoButton;
  /** @const */ this.parentElement = parentElement;
};


/**
 * Attach events to this view's elements that call methods on a controller.
 * @param {othello.GameController} controller the controller that reacts to
 *     the events.
 * @const
 */
othello.GameView.prototype.addControllerEvents = function(controller) {

};


/**
 * Update the HTML document with a fresh view.
 * @const
 */
othello.GameView.prototype.updatePage = function() {
  this.parentElement.html('');
  this.boardView.attachTo(this.parentElement);
  this.parentElement.append(this.undoButton);
};


/**
 * When the board changes, refresh its view.
 * @param {othello.Board} board the board.
 * @param {othello.Piece} playerWhoMoved the player who moved last.
 * @const
 */
othello.GameView.prototype.onModelChange = function(board, playerWhoMoved) {
  this.boardView = othello.BoardTableView.of(board, playerWhoMoved);
  this.updatePage();
};
