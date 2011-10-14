


/**
 * A class to keep track of old boards for the undo feature.
 * @constructor
 * @implements {othello.Observer}
 * @const
 */
othello.UndoStack = function() {
  this.boards = [];
};


/**
 * Push a board onto the stack
 * @param {othello.Board} board the board to push.
 * @const
 */
othello.UndoStack.prototype.push = function(board) {
  this.boards.push(board);
};


/**
 * Remove a board from the stack and return it.
 * @return {othello.Board} the popped board.
 * @const
 */
othello.UndoStack.prototype.pop = function() {
  return this.boards.pop();
};


/**
 * Verify that there are boards in the stack.
 * @return {boolean} whether or not it's safe to call pop.
 * @const
 */
othello.UndoStack.prototype.hasBoards = function() {
  return this.boards.length > 0;
};


/**
 * When the board changes, push the new board onto the stack.
 * @param {othello.Board} board the newly changed board.
 * @param {othello.Piece} unused_currentTurnPlayer the player whose turn it is.
 */
othello.UndoStack.prototype.onModelChange =
    function(board, unused_currentTurnPlayer) {
  this.push(board);
};


/**
 * Act on the initial message. Push the first board on the stack.
 * @param {othello.Board} board the starting board.
 * @param {othello.Piece} unused_piece the starting piece.
 * @const
 */
othello.UndoStack.prototype.onInitialMessage = function(board, unused_piece) {
  this.push(board);
};
