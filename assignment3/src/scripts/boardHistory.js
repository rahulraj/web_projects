


/**
 * A class to keep track of old boards for the undo/redo feature.
 * Representation invariant: Should always have at least one element.
 * Closures are used to hide boards and boardIndex to enforce this.
 * @param {othello.Board} initialBoard the initial board.
 * @constructor
 * @const
 */
othello.BoardHistory = function(initialBoard) {
  /** @const */ var boards = [initialBoard];
  /** @const */ var boardIndex = 0;

  
  /**
   * Push a board onto the history. This means throwing out
   * any redos in front of the current board.
   * @param {othello.Board} board the board to push.
   * @const
   */
  this.push = function(board) {
    /** @const */ var result =
        _.map(_.range(0, boardIndex + 1), function(index) {
      return boards[index];
    });
    result.push(board);
    boards = result;
    boardIndex = boards.length - 1;
  };


  /**
   * Move back by one board. Return the board pointed at.
   * @return {othello.Board} the previous board.
   * @const
   */
  this.undo = function() {
    boardIndex--;
    return boards[boardIndex];
  };


  /**
   * Verify that there are boards in the stack.
   * @return {boolean} whether or not it's safe to undo.
   * @const
   */
  this.canUndo = function() {
    return boardIndex > 0;
  };


  /**
   * Move forward by one baord.
   * @return {othello.Board} the redone board.
   * @const
   */
  this.redo = function() {
    boardIndex++;
    return boards[boardIndex];
  };


  /**
   * Verify that it's possible to redo
   * @return {boolean} whether it's safe  to redo.
   */
  this.canRedo = function() {
    return (boardIndex + 1) < boards.length;
  };
};










