


/**
 * Interface of a Player. It could be a human or AI.
 * @interface
 * @extends {othello.Observer}
 * @const
 */
othello.Player = function() {};


/**
 * Getter for the side this player is on
 * @return {othello.Piece} the Piece this player uses.
 * @const
 */
othello.Player.prototype.getPiece = function() {};



/**
 * Implmentation of Player that programatically decides moves.
 * @param {othello.GameModel} model the model class running the game.
 * @param {othello.Piece} piece the side this object is on.
 * @param {function(othello.Piece, othello.Board): othello.utils.Option}
 *     playerStrategy a pluggable strategy function that determines
 *     the next move.
 * @constructor
 * @implements {othello.Player}
 * @const
 */
othello.AiPlayer = function(model, piece, playerStrategy) {
  /** @const */ this.model = model;
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
 * Getter for this.piece
 * @return {othello.Piece} this.piece.
 * @const
 */
othello.AiPlayer.prototype.getPiece = function() {
  return this.piece;
};


/**
 * Function that the observable can call on this. An AI Player will
 * make a move if it can.
 * @param {othello.Board} board the board.
 * @param {othello.Piece} currentTurnPlayer the player whose turn it is.
 */
othello.AiPlayer.prototype.onModelChange = function(board, currentTurnPlayer) {
  if (currentTurnPlayer !== this.piece) {
    return;
  }
  // it's my turn
  /** @const */ var move = this.makeMove(board);
  this.model.step(move);
};


/**
 * Act on the initial message. If I am black, make the first move.
 * @param {othello.Board} board the starting board.
 * @param {othello.Piece} piece the starting piece.
 * @const
 */
othello.AiPlayer.prototype.onInitialMessage = function(board, piece) {
  this.onModelChange(board, piece);
};


/**
 * Act on the final message. 
 * @param {othello.Board} unused_board the ending board.
 * @param {othello.Piece} unused_piece the ending piece.
 * @const
 */
othello.AiPlayer.prototype.onGameEnd =
    function(unused_board, unused_piece) {};


/**
 * Factory function to create a random AI
 * @param {othello.GameModel} model the game model.
 * @param {othello.Piece} piece the side the AI is on.
 * @return {othello.AiPlayer} an AI player configured to randomly move.
 * @const
 */
othello.AiPlayer.createRandomAi = function(model, piece) {
  return new othello.AiPlayer(model, piece, othello.AiPlayer.randomMakeMove);
};


/**
 * Factory function to create a greedy AI
 * @param {othello.GameModel} model the game model.
 * @param {othello.Piece} piece the side the AI is on.
 * @return {othello.AiPlayer} an AI player configured with a greedy algorithm.
 * @const
 */
othello.AiPlayer.createGreedyAi = function(model, piece) {
  return new othello.AiPlayer(model, piece, othello.AiPlayer.greedyMakeMove);
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
 * A human implmentation of Player. Mainly a placeholder, since an observer
 * is expected.
 * @param {othello.Piece} piece the piece representing the side the player
 *    is on.
 * @constructor
 * @implements {othello.Player}
 * @const
 */
othello.HumanPlayer = function(piece) {
  /** @const */ this.piece = piece;
};


/**
 * Getter for this.piece
 * @return {othello.Piece} this.piece.
 * @const
 */
othello.HumanPlayer.prototype.getPiece = function() {
  return this.piece;
};


/**
 * The human acts through the GUI, so this is a no-op
 * @param {othello.Board} unused_board the board after change.
 * @param {othello.Piece} unused_playerWhoMoved the player who last moved.
 */
othello.HumanPlayer.prototype.onModelChange =
    function(unused_board, unused_playerWhoMoved) {};


/**
 * For humans, this is also a no-op.
 * @param {othello.Board} unused_board the starting board.
 * @param {othello.Piece} unused_piece the starting piece.
 * @const
 */
othello.HumanPlayer.prototype.onInitialMessage =
    function(unused_board, unused_piece) {};


/**
 * End of the game is a no-op.
 * @param {othello.Board} unused_board the ending board.
 * @param {othello.Piece} unused_piece the ending piece.
 * @const
 */
othello.HumanPlayer.prototype.onGameEnd =
    function(unused_board, unused_piece) {};
