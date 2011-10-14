


/**
 * Observer in the Observer pattern
 * @interface
 * @const
 */
othello.Observer = function() {};


/**
 * Call this method to update the observer about a board change.
 * @param {othello.Board} board the newly changed board.
 * @param {othello.Piece} currentTurnPlayer the piece for the player
 *    whose turn it is.
 * @const
 */
othello.Observer.prototype.onModelChange = function(board, currentTurnPlayer) {};


/**
 * Act on the initial message
 * @param {othello.Board} board the starting board.
 * @param {othello.Piece} piece the starting piece.
 * @const
 */
othello.Observer.prototype.onInitialMessage = function(board, piece) {};
