


/**
 * Controller to handle all input events for the game.
 * @param {othello.GameModel} model the model that this controller
 *    interacts with.
 * @param {othello.GameView} view the view that this controller controls.
 * @param {function(othello.Piece): boolean} isHuman a function that takes
 *     a Piece and reports whether the player playing that piece is a human.
 * @constructor
 * @const
 */
othello.GameController = function(model, view, isHuman) {
  /** @const */ this.model = model;
  /** @const */ this.view = view;
  /** @const */ this.isHuman = isHuman;
};


/**
 * Function to invoke when a button on the board is clicked.
 * @param {number} row the button row.
 * @param {number} column the button column.
 * @const
 */
othello.GameController.prototype.onBoardButtonClicked = function(row, column) {
  /** @const */ var currentTurnPlayer = this.model.getCurrentTurnPlayer();
  if (!(this.model.moveIsValid(currentTurnPlayer, row, column))) {
    return;
  }
  if (this.model.isUndoing()) {
    if (this.isHuman(currentTurnPlayer)) {
      // The human is trying to resume. 
      this.model.resumeGame();
    } else {
      window.alert("This is the AI's turn, and you can't move on its " +
                   "behalf. Hit Undo again to make it your turn.");
      return;
    }
  }
  // This is a valid move for the human.
  /** @const */ var moveInSome = new othello.utils.Some(
      this.model.makeMove(currentTurnPlayer, row, column));
  this.model.step(moveInSome);
};


/**
 * Function to pass.
 * @const
 */
othello.GameController.prototype.onPassButtonClicked = function() {
  /** @const */ var currentTurnPlayer = this.model.getCurrentTurnPlayer();
  if (this.model.canMove(currentTurnPlayer)) {
    window.alert("Sorry, you can't pass when you have available move(s)");
    return;
  }
  if (this.model.isUndoing()) {
    if (this.isHuman(currentTurnPlayer)) {
      this.model.resumeGame(); 
    } else {
      window.alert("This is the AI's turn, and you can't move on its " +
                   "behalf. Hit Undo again to make it your turn.");
      return;
    }
  }
  this.model.step(othello.utils.None.instance);
};


/**
 * Function to undo a move
 * @const
 */
othello.GameController.prototype.onUndoButtonClicked = function() {
  if (!this.model.canUndo()) {
    window.alert("Can't undo, at the beginning of the game.");
    return;
  }
  this.model.undo();
};


/**
 * Redo a move
 * @const
 */
othello.GameController.prototype.onRedoButtonClicked = function() {
  if (!this.model.canRedo()) {
    window.alert("Can't redo at this point");
    return;
  }
  this.model.redo();
};
