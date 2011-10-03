
/**
 * Interface of a Player. It could be a human or AI.
 * @interface
 */
othello.Player = function() {};

/**
 * Abstract method, to decide the next move.
 * @param {othello.Board} the board to move on.
 */
othello.Player.prototype.makeMove = function(board) {};


/**
 * Implmentation of Player that programatically decides moves.
 * @param {othello.Piece} piece the side this object is on.
 * @param {function(othello.Piece, othello.Board): othello.Board} playerStrategy
 *     a pluggable strategy function that determines the next move.
 */
othello.Player.AiPlayer = function(piece, playerStrategy) {
  /** @const */ this.piece = piece;
  /** @const */ this.playerStrategy = playerStrategy;
};


othello.Player.AiPlayer.prototype.makeMove = function(board) {
  return this.playerStrategy.call(null, this.piece, board);
};


/**
 * Simple AI strategy - randomly pick a move and make it.
 * @param {othello.Piece} piece the piece representing this player's side.
 * @param {othello.Board} baord the board to move on.
 * @return {othello.Board} the board after the move, leaving the old board
 *     unchanged.
 */
othello.Player.AiPlayer.randomMakeMove = function(piece, board) {
  /** @const */ var possibleMoves = board.findPossibleMoves(piece);
  /** @const */ var index = Math.floor(Math.random() * possibleMoves.length);
  /** @const */ var locationOfMove = possibleMoves[index];
  return board.makeMove(piece, locationOfMove.getX(), locationOfMove.getY());
};

/**
 * Greedy AI strategy - at each step, make the move that has the highest gain.
 * @param {othello.Piece} piece the piece representing this player's side.
 * @param {othello.Board} baord the board to move on.
 * @return {othello.Board} the board after the move, leaving the old board
 *     unchanged.
 */
othello.Player.AiPlayer.greedyMakeMove = function(piece, board) {
  /** @const */ var possibleMoves = board.findPossibleMoves(piece);
  return _(possibleMoves).reduce(function(bestSoFar, current) {
    /** @const */ var bestSoFarBoard = board.makeMove(piece, bestSoFar.getX(),
        bestSoFar.getY());
    /** @const */ var currentBoard = board.makeMove(piece, current.getX(),
        current.getY());
    /** @const */ var bestSoFarScore = bestSoFarBoard.getNumberOfPieces(piece);
    /** @const */ var currentScore = currentBoard.getNumberOfPieces(piece);
    return bestSoFarScore >= currentScore ? bestSoFarScore : currentScore;
  }, possibleMoves[0]);
};
