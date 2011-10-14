


/**
 * TODO DEBUG
 * A class to keep track of old boards for the undo/redo feature.
 * Representation invariant: Should always have at least one element.
 * @param {othello.Board} initial board the initial board
 * @constructor
 * @const
 */
othello.BoardHistory = function(initialBoard) {
  this.boards = [initialBoard];
  this.boardIndex = 0;
};


/**
 * Push a board onto the stack. This means throwing out
 * any redos in front of the current board.
 * @param {othello.Board} board the board to push.
 * @const
 */
othello.BoardHistory.prototype.push = function(board) {
  /** @const */ var self = this;
  /** @const */ var result =
      _.map(_.range(0, this.boardIndex + 1), function(index) {
        return self.boards[index];
      });
  result.push(board);
  this.boards = result;
  this.boardIndex = this.boards.length - 1;
};


/**
 * Move back by one board. Return the board pointed at.
 * @return {othello.Board} the previous board.
 * @const
 */
othello.BoardHistory.prototype.undo = function() {
  this.boardIndex--;
  return this.boards[this.boardIndex];
};


/**
 * Verify that there are boards in the stack.
 * @return {boolean} whether or not it's safe to undo.
 * @const
 */
othello.BoardHistory.prototype.canUndo = function() {
  return this.boardIndex > 0;
};


/**
 * Move forward by one baord.
 * @return {othello.Board} the redone board.
 * @const
 */
othello.BoardHistory.prototype.redo = function() {
  this.boardIndex++;
  return this.boards[this.boardIndex];
};


/**
 * Verify that it's possible to redo
 * @return {boolean} whether it's safe  to redo.
 */
othello.BoardHistory.prototype.canRedo = function() {
  return (this.boardIndex + 1) < this.boards.length;
};
