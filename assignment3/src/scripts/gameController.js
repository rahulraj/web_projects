


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
 * @const
 * @type {string}
 */
othello.GameController.cantMoveForAi =
    "This is the AI's turn, and you can't move on its " +
    'behalf. Hit Undo or Redo to make it your turn.';


/**
 * @const
 * @type {string}
 */
othello.GameController.cantPassWhenYouHaveMoves =
    "You can't pass when you have available move(s)"


/**
 * @const
 * @type {string}
 */
othello.GameController.cantUndoAtGameStart =
    "Can't undo, at the beginning of the game."


/**
 * @const
 * @type {string}
 */
othello.GameController.cantRedoNow =
    "Can't redo at this point"


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
      this.view.sendUserMessage(othello.GameController.cantMoveForAi);
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
    this.view.sendUserMessage(othello.GameController.cantPassWhenYouHaveMoves);
    return;
  }
  if (this.model.isUndoing()) {
    if (this.isHuman(currentTurnPlayer)) {
      this.model.resumeGame();
    } else {
      this.view.sendUserMessage(othello.GameController.cantMoveForAi);
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
    this.view.sendUserMessage(othello.GameController.cantUndoAtGameStart);
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
    this.view.sendUserMessage(othello.GameController.cantRedoNow);
    return;
  }
  this.model.redo();
};


/**
 * Restart the game.
 * @const
 */
othello.GameController.prototype.onRestartButtonClicked = function() {
  window.location.reload();
};
