


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


othello.AiPlayer.createAlphaBetaAi = function(model, piece) {
  return new othello.AiPlayer(model, piece, othello.AiPlayer.alphaBetaMakeMove);
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
 * Evaluate a board.
 * @param {othello.Piece} piece the side whose perspective to take.
 * @param {othello.Board} board the board to evaluate.
 * @return {number} a numerical rating of the position.
 */
othello.AiPlayer.evaluateBoard = function(piece, board) {
  /** @const */ var myPieces = board.getNumberOfPieces(piece);
  /** @const */ var theirPieces = board.getNumberOfPieces(piece.flip());
  return myPieces - theirPieces;
};


/**
 * Helper function to get the next set of boards from possible moves.
 * @param {othello.Piece} piece the piece to be placed.
 * @param {othello.Board} board the board to move on.
 * @return {Array.<othello.Board>} the candidate next boards.
 */
othello.AiPlayer.findNextBoards = function(piece, board) {
  /** @const */ var nextMoves = board.findPossibleMoves(piece);
 return _(nextMoves).map(function(move) {
    return board.makeMove(piece, move.getX(), move.getY());
  });
};


/**
 * One step of alpha-beta search.
 * @param {othello.Piece} piece the current player's piece.
 * @param {othello.Board} board the board to start from.
 * @param {number} depth how deep to go.
 * @param {number} alpha the worst the maximizer can do.
 * @param {number} beta the worst the minimizer can do.
 * @param {boolean} lastPlayerPassed whether the last player passed.
 */
othello.AiPlayer.alphaBetaFindBoardValue =
    function (piece, board, depth, alpha, beta, lastPlayerPassed) {
  if (depth === 0 || board.isFull()) {
    // leaf of the tree.
    return othello.AiPlayer.evaluateBoard(piece, board);
  }

  if (!board.canMove(piece)) {
    // Special case - we have to pass. 
    if (lastPlayerPassed) {
      // the game is over
      return othello.AiPlayer.evaluateBoard(piece, board);
    }
    /** @const */ var newAlpha = (-1) * beta
    /** @const */ var newBeta = (-1) * alpha
    /** @const */ var currentValue = (-1) *
        othello.AiPlayer.alphaBetaFindBoardValue(
            piece.flip(), board, depth-1, newAlpha, newBeta, true);
    if (currentValue > alpha) {
      alpha = currentValue; 
    }
    return alpha;
  }
  

  /** @const */ var nextBoards = othello.AiPlayer.findNextBoards(piece, board);
  for (var i = 0; i < nextBoards.length; i++) {
    if (alpha >= beta) {
      break; 
    }

    /** @const */ var newAlpha = (-1) * beta
    /** @const */ var newBeta = (-1) * alpha

    /** @const */ var nextBoard = nextBoards[i];

    /** @const */ var currentValue = (-1) *
        othello.AiPlayer.alphaBetaFindBoardValue(
            piece.flip(), nextBoard, depth-1, newAlpha, newBeta, false);
    if (currentValue > alpha) {
      alpha = currentValue; 
    }
  }
  return alpha;
};


/**
 * Start an alpha-beta search
 * @param {othello.Piece} piece the piece taking a move.
 * @param {othello.Board} board the board to move on.
 * @param {number} depth how far down to go.
 * @return {othello.Board} the best next board.
 */
othello.AiPlayer.alphaBetaSearch = function(piece, board, depth) {
  // The player should have a move if we come here.
  var alpha = -1000000000;
  var beta = 1000000000;
  var bestNextBoard = null;

  // Similar to the helper function, but we want the board,
  // not the value of alpha.
  /** @const */ var nextBoards = othello.AiPlayer.findNextBoards(piece, board);
  for (var i = 0; i < nextBoards.length; i++) {
    /** @const */ var newAlpha = (-1) * beta;
    /** @const */ var newBeta = (-1) * alpha;

    /** @const */ var nextBoard = nextBoards[i];
    /** @const */ var currentValue = (-1) *
      othello.AiPlayer.alphaBetaFindBoardValue(
          piece.flip(), nextBoard, depth-1, alpha, beta, false);

    if (currentValue > alpha) {
      alpha = currentValue; 
      bestNextBoard = nextBoard; 
    }
  }
  return bestNextBoard;
};


/**
 * An AI player that uses minimax with alpha-beta pruning!
 * Searches down 4 levels, it became too slow for larger trees.
 * @param {othello.Piece} piece the piece representing this player's side.
 * @param {othello.Board} board the board to move on.
 * @return {othello.utils.Option} the board after the move in a Some,
 *     or None for a pass.
 * @const
 */
othello.AiPlayer.alphaBetaMakeMove = function(piece, board) {
  if (!board.canMove(piece)) {
    return othello.utils.None.instance; 
  }

  /** @const */ var depth = 4;
  return new othello.utils.Some(
      othello.AiPlayer.alphaBetaSearch(piece, board, depth));

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
