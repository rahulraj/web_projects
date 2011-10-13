


/**
 * Observer in the Observer pattern
 * @interface
 */
othello.Observer = function() {};

/**
 * Call this method to update the observer about a board change.
 * @param {othello.Board} board the newly changed board.
 * @param {othello.Player} playerWhoMoved the player who just moved.
 */
othello.Observer.prototype.onModelChange = function(board, playerWhoMoved) {};
