


/**
 * Controller to handle all input events for the game.
 * @param {othello.GameModel} model the model that this controller
 *    interacts with.
 * @param {othello.GameView} view the view that this controller controls.
 * @constructor
 * @const
 */
othello.GameController = function(model, view) {
  /** @const */ this.model = model;
  /** @const */ this.view = view;
};


/**
 * Function to invoke when a button on the board is clicked.
 * @param {number} row the button row.
 * @param {number} column the button column.
 * @const
 */
othello.GameController.prototype.onBoardButtonClicked = function(row, column) {
  if (this.model.isUndoing()) {
    throw new Error('not implemented');
  }
  /** @const */ var currentTurnPlayer = this.model.getCurrentTurnPlayer();
  if (!(this.model.moveIsValid(currentTurnPlayer, row, column))) {
    return;
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
  if (this.model.isUndoing()) {
    throw new Error('not implemented');
  }
  /** @const */ var currentTurnPlayer = this.model.getCurrentTurnPlayer();
  if (this.model.canMove(currentTurnPlayer)) {
    window.alert("Sorry, you can't pass when you have available move(s)");
    return;
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
