


/**
 * Top-level view class for the main game.
 * @param {othello.BoardTableView} boardView the view for the board. Can
 *     mutate as the game changes.
 * @param {jQueryObject} gameStatusDiv the div in which to report the game score.
 * @param {jQueryObject} messageToUserDiv the div in which to leave messages
 *     to the user.
 * @param {jQueryObject} undoButton the button to undo, wrapped in jQuery.
 * @param {jQueryObject} passButton the button to pass, wrapped in jQuery.
 * @param {jQueryObject} resumeButton the button to resume, wrapped in jQuery.
 * @param {jQueryObject} restartButton the button to restart, wrapped in jQuery.
 * @param {jQueryObject} parentElement the parent for this view.
 * @constructor
 * @implements {othello.Observer}
 * @const
 */
othello.GameView =
    function(boardView, gameStatusDiv, messageToUserDiv, undoButton,
             passButton, resumeButton, restartButton, parentElement) {
  this.boardView = boardView;
  /** @const */ this.gameStatusDiv = gameStatusDiv;
  /** @const */ this.messageToUserDiv = messageToUserDiv;
  /** @const */ this.undoButton = undoButton;
  /** @const */ this.passButton = passButton;
  /** @const */ this.resumeButton = resumeButton;
  /** @const */ this.restartButton = restartButton;
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
othello.GameView.redoButtonValue = 'Redo';


/**
 * @const
 * @type {string}
 */
othello.GameView.restartButtonValue = 'Restart';


/**
 * Attach events to this view's elements that call methods on a controller.
 * @param {othello.GameController} controller the controller that reacts to
 *     the events.
 * @const
 */
othello.GameView.prototype.addControllerEvents = function(controller) {
  this.controller = controller;
  this.addClickHandlers(controller);
};


/**
 * Adds click handlers to the divisions in the table
 * @param {othello.GameController} controller the controller handling the input.
 * @const
 */
othello.GameView.prototype.addClickHandlers = function(controller) {
  this.boardView.addClickHandlers(function(row, column) {
    controller.onBoardButtonClicked(row, column);
  });
};


/**
 * Update the HTML document with a fresh view.
 * @const
 */
othello.GameView.prototype.updatePage = function() {
  this.addClickHandlers(this.controller);
  this.parentElement.html('');
  this.boardView.attachTo(this.parentElement);
  this.parentElement.append(this.gameStatusDiv);
  this.parentElement.append(this.messageToUserDiv);
  this.parentElement.append(this.passButton);
  this.parentElement.append(this.undoButton);
  this.parentElement.append(this.resumeButton);
  this.parentElement.append(this.restartButton);
};


/**
 * Report the newest score to the user.
 * @param {number} whiteScore the number of pieces white has.
 * @param {number} blackScore the number of pieces black has.
 */
othello.GameView.prototype.updateScoreReport = function(whiteScore, blackScore) {
  /** @const */ var scoreReport = 'White: ' + whiteScore +
                                  '\nBlack: ' + blackScore;
  this.gameStatusDiv.html(scoreReport);
};


/**
 * Send a message to the user. This will clobber the old message.
 * @param {string} message the message to write.
 * @const
 */
othello.GameView.prototype.sendUserMessage = function(message) {
  this.messageToUserDiv.html(message);
};


/**
 * Clear the messageToUserDiv
 * @const
 */
othello.GameView.prototype.clearUserMessage = function() {
  this.messageToUserDiv.html('');
};


/**
 * When the board changes, refresh its view.
 * @param {othello.Board} board the board.
 * @param {othello.Piece} currentTurnPlayer the player whose turn it is.
 * @const
 */
othello.GameView.prototype.onModelChange = function(board, currentTurnPlayer) {
  this.boardView = othello.BoardDivView.of(board, currentTurnPlayer);
  /** @const */ var whiteScore = board.getNumberOfLightPieces();
  /** @const */ var blackScore = board.getNumberOfDarkPieces();
  this.updateScoreReport(whiteScore, blackScore);
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
  this.sendUserMessage('The game is over. Press Restart to play again.');
};
