


/**
 * Top-level view class for the main game.
 * @param {othello.BoardTableView} boardView the view for the board. Can
 *     mutate as the game changes.
 * @param {jQueryObject} undoButton the button to undo, wrapped in jQuery.
 * @param {jQueryObject} passButton the button to pass, wrapped in jQuery.
 * @param {jQueryObject} resumeButton the button to resume, wrapped in jQuery.
 * @param {jQueryObject} parentElement the parent for this view.
 * @constructor
 * @implements {othello.Observer}
 * @const
 */
othello.GameView =
    function(boardView, undoButton, passButton, resumeButton, parentElement) {
  this.boardView = boardView;
  /** @const */ this.undoButton = undoButton;
  /** @const */ this.passButton = passButton;
  /** @const */ this.resumeButton = resumeButton;
  /** @const */ this.parentElement = parentElement;
};


/**
 * @const
 * @type {string}
 */
othello.GameView.undoButtonValue = 'Undo Last Move';


/**
 * @const
 * @type {string}
 */
othello.GameView.passButtonValue = 'Pass';


/**
 * @const
 * @type {string}
 */
othello.GameView.resumeButtonValue = 'Resume';


/**
 * Attach events to this view's elements that call methods on a controller.
 * @param {othello.GameController} controller the controller that reacts to
 *     the events.
 * @const
 */
othello.GameView.prototype.addControllerEvents = function(controller) {
  this.controller = controller; 
  this.addClickHandlersToTableDivisions(controller);
};


/**
 * Adds click handlers to the divisions in the table
 * @param {othello.Controller} controller the controller handling the input.
 * @const
 */
othello.GameView.prototype.addClickHandlersToTableDivisions =
    function(controller) {
  this.boardView.addClickHandlersToTableDivisions(function(row, column) {
    controller.onBoardButtonClicked(row, column);
  });
};


/**
 * Update the HTML document with a fresh view.
 * @const
 */
othello.GameView.prototype.updatePage = function() {
  this.addClickHandlersToTableDivisions(this.controller);
  this.parentElement.html('');
  this.boardView.attachTo(this.parentElement);
  this.parentElement.append(this.passButton);
  this.parentElement.append(this.undoButton);
  this.parentElement.append(this.resumeButton);
};


/**
 * When the board changes, refresh its view.
 * @param {othello.Board} board the board.
 * @param {othello.Piece} currentTurnPlayer the player whose turn it is.
 * @const
 */
othello.GameView.prototype.onModelChange = function(board, currentTurnPlayer) {
  this.boardView = othello.BoardTableView.of(board, currentTurnPlayer);
  this.updatePage();
};


/**
 * Act on the initial message. Initialize the game view.
 * @param {othello.Board} board the starting board.
 * @param {othello.Piece} piece the starting piece.
 * @const
 */
othello.GameView.prototype.onInitialMessage = function(board, piece) {
  this.onModelChange(board, othello.DarkPiece.instance);
};


/**
 * Act on the end of the game.
 * @param {othello.Board} board the final board.
 * @param {othello.Piece} piece the final piece.
 * @const
 */
othello.GameView.prototype.onGameEnd = function(board, piece) {
  // TODO something more elaborate.
  window.alert('game is over');
};
