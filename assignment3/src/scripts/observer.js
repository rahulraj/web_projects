


/**
 * Observer in the Observer pattern
 * @interface
 */
othello.Observer = function() {};

/**
 * Call this method to update the observer about a board change.
 * @param {othello.Board} the newly changed board.
 * @param {othello.Player} the player who just moved.
 */
othello.Observer.prototype.onModelChange = function(board, playerWhoMoved) {};
