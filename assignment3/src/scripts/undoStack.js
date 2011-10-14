


/**
 * A class to keep track of old boards for the undo feature.
 * TODO Add redo (instead of removing undone boards, just move a pointer)
 * @constructor
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
