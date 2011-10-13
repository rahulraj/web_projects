


/**
 * Top-level view class.
 * @param {othello.GameStartForm} startForm the form for starting the game.
 * @param {othello.BoardTableView} boardView the view for the board. Can
 *     mutate as the game changes.
 * @param {jQuery} undoButton the button to undo, wrapped in jQuery
 * @param {jQuery} parentElement the parent for this view.
 * @constructor
 * @implements {othello.Observer}
 * @const
 */
othello.GameView = function(startForm, boardView, undoButton, parentElement) {
  /** @const */ this.startForm = startForm;
  this.boardView = boardView;
  /** @const */ this.undoButton = undoButton;
  /** @const */ this.parentElement = parentElement;
};


/**
 * Update the HTML document with a fresh view.
 * @const
 */
othello.GameView.prototype.updatePage = function() {
  this.parentElement.html('');
  this.startForm.attachTo(this.parentElement);
  this.boardView.attachTo(this.parentElement);
  this.parentElement.append(this.undoButton);
};

/**
 * When the board changes, refresh its view.
 * @const
 */
othello.GameView.prototype.onModelChange = function(board, playerWhoMoved) {
  this.boardView = othello.BoardTableView.of(board, playerWhoMoved);
  this.updatePage();
};

/**
 * Factory function to create a view, and add it to the HTML document.
 * @param {jQuery} parentElement the parent for the view.
 * @return {othello.GameView} the view created.
 */
othello.GameView.createDefaultViewOnPage = function(parentElement) {
  /** @const */ var form = othello.GameStartForm.createDefaultStartForm();
  /** @const */ var initialBoard =
      othello.BoardTableView.of(othello.Board.Builder.initialGame().build(),
      othello.DarkPiece.instance);
  /** @const */ var undoButton = $('<input>', {
      type: 'button', value: 'Undo Last Move'}); 
  /** @const */ var view = new othello.GameView(form, initialBoard, undoButton,
      parentElement);
  view.updatePage();
  return view;
};
