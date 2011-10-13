


/**
 * Interface of a Player. It could be a human or AI.
 * @interface
 * @const
 */
othello.Player = function() {};


/**
 * Abstract method, to decide the next move.
 * @param {othello.Board} board the board to move on.
 * @return {othello.utils.Option} a new Board object inside an Option
 *    representing the state of the game after the move. Will be None
 *    if the player had to pass.
 * @const
 */
othello.Player.prototype.makeMove = function(board) {};


/**
 * Report whether the Player's state is consistent enough such that
 * makeMove will return a valid result.
 * @return {boolean} true if it is safe to call makeMove.
 * @const
 */
othello.Player.prototype.readyToMove = function() {};


/**
 * Getter for the side this player is on
 * @return {othello.Piece} the Piece this player uses.
 * @const
 */
othello.Player.prototype.getPiece = function() {};



/**
 * Implmentation of Player that programatically decides moves.
 * TODO Make this observe the board.
 * @param {othello.Piece} piece the side this object is on.
 * @param {function(othello.Piece, othello.Board): othello.utils.Option}
 *     playerStrategy a pluggable strategy function that determines
 *     the next move.
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
 * @return {othello.utils.Option} a new Board object inside an Option
 *    representing the state of the game after the move. Will be None
 *    if the player had to pass.
 * @const
 */
othello.AiPlayer.prototype.makeMove = function(board) {
  return this.playerStrategy(this.piece, board);
};


/**
 * AI players are always ready.
 * @return {boolean} true if it is safe to call makeMove.
 */
othello.AiPlayer.prototype.readyToMove = function() {
  return true;
};


/**
 * Getter for this.piece
 * @return {othello.Piece} this.piece.
 * @const
 */
othello.AiPlayer.prototype.getPiece = function() {
  return this.piece;
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
 * @return {othello.utils.Option} the board after the move, leaving the old
 *     board unchanged in a Some, or None if the player had to pass.
 * @const
 */
othello.AiPlayer.randomMakeMove = function(piece, board) {
  /** @const */ var possibleMoves = board.findPossibleMoves(piece);
  if (!(board.canMove(piece))) {
    return othello.utils.None.instance;
  }
  /** @const */ var index = Math.floor(Math.random() * possibleMoves.length);
  /** @const */ var locationOfMove = possibleMoves[index];
  return new othello.utils.Some(
      board.makeMove(piece, locationOfMove.getX(), locationOfMove.getY()));
};


/**
 * Greedy AI strategy - at each step, make the move that has the highest gain.
 * @param {othello.Piece} piece the piece representing this player's side.
 * @param {othello.Board} board the board to move on.
 * @return {othello.utils.Option} the board after the move, leaving the old
 *     board unchanged in a Some, or None if the player had to pass.
 * @const
 */
othello.AiPlayer.greedyMakeMove = function(piece, board) {
  /** @const */ var possibleMoves = board.findPossibleMoves(piece);
  if (!(board.canMove(piece))) {
    return othello.utils.None.instance;
  }

  /** @const */ var newBoards = _(possibleMoves).map(function(move) {
    return board.makeMove(piece, move.getX(), move.getY());
  });
  /** @const */ var scores = _(newBoards).map(function(newBoard) {
    return newBoard.getNumberOfPieces(piece);
  });

  /** @const */ var boardsAndScores = _.zip(newBoards, scores);

  /** @const */ var nextBoard = _(boardsAndScores).reduce(
      function(bestSoFar, current) {
        /** @const */ var bestSoFarBoard = bestSoFar[0];
        /** @const */ var bestSoFarScore = bestSoFar[1];
        /** @const */ var currentBoard = current[0];
        /** @const */ var currentScore = current[1];
        return bestSoFarScore >= currentScore ? bestSoFarBoard : currentBoard;
      }, boardsAndScores[0][0]);
  return new othello.utils.Some(nextBoard);
};



/**
 * A human implmentation of Player. Moves based on user input.
 * @param {othello.Piece} piece the piece representing the side the player
 *    is on.
 * @constructor
 * @implements {othello.Player}
 * @const
 */
othello.HumanPlayer = function(piece) {
  /** @const */ this.piece = piece;
  // TODO see if there's a way other than using null AND Option
  this.moveBuffer = null;
};


/**
 * Add a move to the buffer. This move should be checked for
 * validity beforehand.
 * @param {othello.utils.Option} move the Point on where to place a piece,
 *    wrapped in an Option. Some(Point) for a move, None to pass.
 * @const
 */
othello.HumanPlayer.prototype.addMove = function(move) {
  this.moveBuffer = move;
};


/**
 * Clears the buffer, setting its value to null
 * @const
 */
othello.HumanPlayer.prototype.clearBuffer = function() {
  this.moveBuffer = null;
};


/**
 * The player is ready to move if user input has filled the buffer.
 * @return {boolean} true if the buffer is filled.
 */
othello.HumanPlayer.prototype.readyToMove = function() {
  return this.moveBuffer !== null;
};


/**
 * Makes a move based on what the player inputted.
 * @param {othello.Board} board the board to move on.
 * @return {othello.utils.Option} a new Board object inside an Option
 *    representing the state of the game after the move. Will be None
 *    if the player had to pass.
 * @const
 */
othello.HumanPlayer.prototype.makeMove = function(board) {
  if (!(this.readyToMove())) {
    // Yield control and give the user time to input a move.
    // Block until this.moveBuffer has something in it.
    ///** @const */ var self = this;
    //window.setTimeout(function() {
    // this.makeMove(board);
    //}, othello.HumanPlayer.delayInterval);
    throw new Error('Human tried to move before being ready!');
  } else if (this.moveBuffer === othello.utils.None.instance) {
    // pass
    return othello.utils.None.instance;
  } else {
    // move should never be null
    /** @const */ var move = this.moveBuffer.getOrElse(null);
    /** @const */ var newBoard = board.makeMove(
        this.piece, move.getX(), move.getY());
    this.clearBuffer();
    return new othello.utils.Some(newBoard);
  }
};


/**
 * Getter for this.piece
 * @return {othello.Piece} this.piece.
 * @const
 */
othello.HumanPlayer.prototype.getPiece = function() {
  return this.piece;
};
