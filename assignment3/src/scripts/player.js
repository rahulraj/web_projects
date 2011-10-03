
/**
 * Interface of a Player. It could be a human or AI.
 * @interface
 * @const
 */
othello.Player = function() {};

/**
 * Abstract method, to decide the next move.
 * @param {othello.Board} board the board to move on.
 * @return {othello.Board} a new board object representing the state after the
 *     move.
 * @const
 */
othello.Player.prototype.makeMove = function(board) {};


/**
 * Implmentation of Player that programatically decides moves.
 * @param {othello.Piece} piece the side this object is on.
 * @param {function(othello.Piece, othello.Board): othello.Board} playerStrategy
 *     a pluggable strategy function that determines the next move.
 * @constructor
 * @implements {othello.Player}
 * @const
 */
othello.AiPlayer = function(piece, playerStrategy) {
  /** @const */ this.piece = piece;
  /** @const */ this.playerStrategy = playerStrategy;
};


/**
 * Decide the next move through playerStrategy.
 * @param {othello.Board} board the board to move on.
 * @return {othello.Board} a new Board object representing the state after the
 *     move.
 * @const
 */
othello.AiPlayer.prototype.makeMove = function(board) {
  return this.playerStrategy(this.piece, board);
};


/**
 * Factory function to create a random AI
 * @param {othello.Piece} piece the side the AI is on.
 * @return {othello.AiPlayer} an AI player configured to randomly move.
 * @const
 */
othello.AiPlayer.createRandomAi = function(piece) {
  return new othello.AiPlayer(piece, othello.AiPlayer.randomMakeMove);
};


/**
 * Factory function to create a greedy AI
 * @param {othello.Piece} piece the side the AI is on.
 * @return {othello.AiPlayer} an AI player configured with a greedy algorithm.
 * @const
 */
othello.AiPlayer.createGreedyAi = function(piece) {
  return new othello.AiPlayer(piece, othello.AiPlayer.greedyMakeMove);
};


/**
 * Simple AI strategy - randomly pick a move and make it.
 * @param {othello.Piece} piece the piece representing this player's side.
 * @param {othello.Board} board the board to move on.
 * @return {othello.Board} the board after the move, leaving the old board
 *     unchanged.
 * @const
 */
othello.AiPlayer.randomMakeMove = function(piece, board) {
  /** @const */ var possibleMoves = board.findPossibleMoves(piece);
  /** @const */ var index = Math.floor(Math.random() * possibleMoves.length);
  /** @const */ var locationOfMove = possibleMoves[index];
  return board.makeMove(piece, locationOfMove.getX(), locationOfMove.getY());
};

/**
 * Greedy AI strategy - at each step, make the move that has the highest gain.
 * @param {othello.Piece} piece the piece representing this player's side.
 * @param {othello.Board} board the board to move on.
 * @return {othello.Board} the board after the move, leaving the old board
 *     unchanged.
 * @const
 */
othello.AiPlayer.greedyMakeMove = function(piece, board) {
  /** @const */ var possibleMoves = board.findPossibleMoves(piece);

  /** @const */ var newBoards = _(possibleMoves).map(function(move) {
    return board.makeMove(piece, move.getX(), move.getY());
  });
  /** @const */ var scores = _(newBoards).map(function(newBoard) {
    return newBoard.getNumberOfPieces(piece);
  });

  /** @const */ var boardsAndScores = _.zip(newBoards, scores);

  return _(boardsAndScores).reduce(function(bestSoFar, current) {
    /** @const */ var bestSoFarBoard = bestSoFar[0];
    /** @const */ var bestSoFarScore = bestSoFar[1];
    /** @const */ var currentBoard = current[0];
    /** @const */ var currentScore = current[1];
    return bestSoFarScore >= currentScore ? bestSoFarBoard : currentBoard;
  }, boardsAndScores[0][0]);
};
