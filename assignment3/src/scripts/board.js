


/**
 * Constructor for an Othello board. Client code should not
 * call this constructor directly; use the Builder instead.
 * Using the Builder pattern in this case has the following advantages:
 *   - Allows multi-step construction.
 *   - Cleaner syntax for creating a board, hiding the 2D array implementation.
 *   - Allows Boards to be immutable; all mutability is contained in Builders.
 * Representation Invariants:
 *   - Immutable - every move should create a new board.
 *     Use the Builder to creat boards more easily.
 *   - All squares must contain an othello.Piece, it may not
 *     be null or some other type.
 * @param {Array.<Array.<othello.Piece>>} board a 2D array
 *     representing the board.
 * @param {number} numberOfLightPieces the number of light pieces.
 * @param {number} numberOfDarkPieces the number of dark pieces.
 * @constructor
 * @const
 */
othello.Board = function(board, numberOfLightPieces, numberOfDarkPieces) {
  /**
   * Retrieve the piece at a given location. Closes over board to
   * accomplish this. Board is not stored as a field, to guard
   * against representation exposure and more easily guarantee immutability.
   * Most methods are attached to othello.Board.prototype for performance
   * reasons. In this case, an exception was made because this function
   * is cruicial towards the goal of achieving immutability.
   * @param {number} row the row.
   * @param {number} column the column.
   * @return {othello.Piece} the Piece at that location.
   * @const
   */
  this.pieceAt = function(row, column) {
    return board[row][column];
  };


  /** @const */ this.numberOfLightPieces = numberOfLightPieces;
  /** @const */ this.numberOfDarkPieces = numberOfDarkPieces;
};


/**
 * Get the number of pieces of a specified type.
 * @param {othello.Piece} piece the side to check.
 * @return {number} the number of pieces.
 */
othello.Board.prototype.getNumberOfPieces = function(piece) {
  // TODO refactor to use polymorphism
  if (piece instanceof othello.LightPiece) {
    return this.getNumberOfLightPieces();
  } else if (piece instanceof othello.DarkPiece) {
    return this.getNumberOfDarkPieces();
  }
  throw new Error('Meaningless to calculate number of empty pieces');
};


/**
 * Getter function for the number of light pieces
 * @return {number} this.numberOfLightPieces.
 */
othello.Board.prototype.getNumberOfLightPieces = function() {
  return this.numberOfLightPieces;
};


/**
 * Getter function for the number of dark pieces
 * @return {number} this.numberOfDarkPieces.
 */
othello.Board.prototype.getNumberOfDarkPieces = function() {
  return this.numberOfDarkPieces;
};


/**
 * A client-facing method that makes one move in the game,
 * placing piece at (x, y) and returning the new Board that results.
 * Does not mutate this.board, creates a new Board instead.
 * @param {othello.Piece} piece the piece being placed.
 * @param {number} x the x coordinate to place it on.
 * @param {number} y the y coordinate to place it on.
 * @return {othello.Board} the new board that results.
 * @throws {Error} if the move is invalid. Clients should verify the move
 *    with findPossibleMoves first.
 */
othello.Board.prototype.makeMove = function(piece, x, y) {
  if (!(this.placementIsValid(piece, x, y))) {
    throw new Error('Invalid move attempted!');
  }

  /** @const */ var flipped = this.findAllPiecesToFlip(piece, x, y);
  /** @const */ var newBoardBuilder = othello.Board.Builder.templatedBy(this);
  newBoardBuilder.at(x, y).place(piece);
  _(flipped).each(function(point) {
    newBoardBuilder.at(point.getX(), point.getY()).flip();
  });
  return newBoardBuilder.build();
};


/**
 * Given a proposed location to place a piece, return true
 * if it is valid.
 * @param {othello.Piece} piece the piece being placed.
 * @param {number} x the x coordinate for the piece.
 * @param {number} y the y coordinate for the piece.
 * @return {boolean} true if it is a legal move to place the piece there.
 */
othello.Board.prototype.placementIsValid = function(piece, x, y) {
  if (this.isOccupiedAt(x, y)) {
    return false;
  }
  /** @const */ var flipped = this.findAllPiecesToFlip(piece, x, y);
  return flipped.length > 0;
};


/**
 * Convenience method that tells if a player can move
 * @param {othello.Piece} piece the Piece for the player trying to move.
 * @return {boolean} true if that player has moves.
 */
othello.Board.prototype.canMove = function(piece) {
  return this.findPossibleMoves(piece).length !== 0;
};


/**
 * Find the possible moves that a player can make.
 * @param {othello.Piece} piece the piece representing the player's color.
 * @return {Array.<othello.Point>} an array of the available Points
 *     on which the piece can be legally placed. Empty if no Points exist.
 */
othello.Board.prototype.findPossibleMoves = function(piece) {
  /** @const */ var rows = _.range(0, othello.Board.size);
  /** @const */ var self = this;
  return othello.utils.flatMap(rows, function(row) {
    /** @const */ var pointsOnRow =
        _.map(_.range(0, othello.Board.size), function(column) {
      return new othello.Point(row, column);
    });
    return _(pointsOnRow).filter(function(point) {
      return self.placementIsValid(piece, point.getX(), point.getY());
    });
  });
};


/**
 * Given an initial location and a piece, returns the coordinates of
 * all the pieces that would be flipped if piece was placed in the initial
 * location.
 * @param {othello.Piece} piece the piece being placed.
 * @param {number} x the x coordinate.
 * @param {number} y the y coordinate.
 * @return {Array.<othello.Point>} an Array
 *    containing the coordinates of all the pieces that would be flipped.
 */
othello.Board.prototype.findAllPiecesToFlip = function(piece, x, y) {
  /** @const */ var self = this;
  return othello.utils.flatMap(othello.Board.deltas(), function(delta) {
    return self.findPiecesToFlip(piece, x, y, delta[0], delta[1]);
  });
};


/**
 * Return a list of lists containing the appropriate values for
 * deltaX and deltaY
 * @return {Array.<Array.<number>>} a list of deltas, as x, y tuples.
 */
othello.Board.deltas = function() {
  /** @const */ var allCombinations = othello.utils.flatMap(_.range(-1, 2),
      function(item) {
        return [[-1, item], [0, item], [1, item]];
      });
  return _(allCombinations).reject(function removeTheZeroPair(item) {
    return item[0] === 0 && item[1] === 0;
  });
};


/**
 * Walk in a given direction, and locate all the coordinates
 * whose pieces need to be flipped. This will be all the pieces
 * in the line that starts at the original location, and ends at
 * the first square found that contains another piece of the same color.
 * If the chain is broken by an empty square or the edge of the board,
 * this means no pieces can be flipped. Presumably, we are analyzing
 * the effects of a move that places a piece in (initialX, initialY).
 * @param {othello.Piece} piece the piece being placed in the first point.
 * @param {number} initialX the initial x coordinate.
 * @param {number} initialY the initial y coordinate.
 * @param {number} deltaX the amount by which to change x in each step.
 * @param {number} deltaY the amount by which to change y in each step.
 * @return {Array.<othello.Point>} an
 *     array containing Points with the coordinates of pieces to flip.
 *     If no pieces can be flipped, returns an empty array.
 */
othello.Board.prototype.findPiecesToFlip =
    function(piece, initialX, initialY, deltaX, deltaY) {
  var next = this.nextSquare(initialX, initialY, deltaX, deltaY);
  var contents = next.getOrElse(othello.EmptyPiece.instance);
  if (contents === othello.EmptyPiece.instance ||
      contents === piece) {
    // It's next to an empty square or a piece of the same color.
    return [];
  }
  // Now keep walking down the chain
  var currentX = initialX + deltaX;
  var currentY = initialY + deltaY;
  // But don't forget to add the coordinates we just stepped over.
  /** @const */ var firstStepCoordinates =
      new othello.Point(currentX, currentY);
  /** @const */ var captured = [firstStepCoordinates];
  while (true) {
    next = this.nextSquare(currentX, currentY, deltaX, deltaY);
    contents = next.getOrElse(othello.EmptyPiece.instance);
    if (contents === othello.EmptyPiece.instance) {
      // the chain broke
      return [];
    }
    else if (contents === piece) {
      // end of a valid chain, return the chain
      return captured;
    } else {
      // add the location of the piece we're passing over to captured
      /** @const */ var currentCoordinates =
          new othello.Point(currentX, currentY);
      captured.push(currentCoordinates);
      currentX += deltaX;
      currentY += deltaY;
    }
  }
};


/**
 * Test if a square is occupied
 * @param {number} x the x coordinate.
 * @param {number} y the y coordinate.
 * @return {boolean} true if the square is occupied.
 */
othello.Board.prototype.isOccupiedAt = function(x, y) {
  return this.pieceAt(x, y) !== othello.EmptyPiece.instance;
};


/**
 * Get the contents of a square via relative positioning
 * @param {number} row the initial row.
 * @param {number} column the initial column.
 * @param {number} deltaX the amount by which to change the X coordinate.
 * @param {number} deltaY the amount by which to change the Y coordinate.
 * @return {othello.utils.Option} Some(Piece in the found square) or None if
 *     we go off the board.
 */
othello.Board.prototype.nextSquare = function(row, column, deltaX, deltaY) {
  /** @const */ var newRow = row + deltaX;
  /** @const */ var newColumn = column + deltaY;
  if (this.inBounds(newRow, newColumn)) {
    return new othello.utils.Some(this.pieceAt(newRow, newColumn));
  } else {
    return othello.utils.None.instance;
  }
};


/**
 * Helper function to tell if a pair of coordinate is in bounds.
 * @param {number} x the x coordinate.
 * @param {number} y the y coordinate.
 * @return {boolean} true if it is safe to index this Board with
 *     the given coordinates.
 */
othello.Board.prototype.inBounds = function(x, y) {
  return x >= 0 && x < othello.Board.size &&
         y >= 0 && y < othello.Board.size;
};


/**
 * @const
 * @type {number}
 */
othello.Board.size = 8;



/**
 * Constructor for an Othello board builder
 * @param {Array.<Array.<othello.Piece>>} board the board to start with.
 * @constructor
 * @const
 */
othello.Board.Builder = function(board) {
  /** @const */ this.board = board;
};


/**
 * Named constructor to create an empty board as a Builder
 * @return {othello.Board.Builder} the created Builder.
 * @const
 */
othello.Board.Builder.emptyBoard = function() {
  /** @const */ var board = [];
  _.each(_.range(0, othello.Board.size), function(i) {
    board.push(othello.Board.Builder.createRow());
  });

  return new othello.Board.Builder(board);
};


/**
 * Named constructor to create a new Board from an old one.
 * @param {othello.Board} board the old board.
 * @return {othello.Board.Builder} a new Builder based off
 *     the old board.
 */
othello.Board.Builder.templatedBy = function(board) {
  /** @const */ var builder = othello.Board.Builder.emptyBoard();
  _.each(_.range(0, othello.Board.size), function(i) {
    _.each(_.range(0, othello.Board.size), function(j) {
      builder.at(i, j).place(board.pieceAt(i, j));
    });
  });
  return builder;
};


/**
 * Name constructor to create an initial game as a Builder
 * @return {othello.Board.Builder} the created Builder.
 * @const
 */
othello.Board.Builder.initialGame = function() {
  return othello.Board.Builder.emptyBoard().
      at(3, 3).placeLightPiece().
      at(3, 4).placeDarkPiece().
      at(4, 3).placeDarkPiece().
      at(4, 4).placeLightPiece();
};


/**
 * Position row and column before modifying a square. Used to make
 * the interface more fluent. That is, client code can write
 * builder.at(3, 3).placeLightPiece() instead of
 * builder.placeLightPiece(3, 3). The former is more readable.
 * This syntax also avoids a possible bug by requiring that the client
 * specify a row and column before placing a piece.
 * @param {number} row the value for the row.
 * @param {number} column the value for the column.
 * @return {{place: function(othello.Piece): othello.Board.Builder,
 *           placeLightPiece: function(): othello.Board.Builder,
 *           placeDarkPiece: function(): othello.Board.Builder,
 *           flip: function(): othello.Board.Builder}} an object wrapping
 *           functions that can be called after calling at. They make the
 *           necessary placements, using closures to access row, column, and
 *           the Builder, which is returned afterwards for further changes.
 * @const
 */
othello.Board.Builder.prototype.at = function(row, column) {
  /** @const */ var builder = this;
  /**
   * Add an arbitrary piece to the board
   * @param {othello.Piece} piece the piece to add.
   * @return {othello.Board.Builder} the Builder for chaining.
   * @const
   */
  var placePiece = function(piece) {
    builder.board[row][column] = piece;
    return builder;
  };

  return {
    place: placePiece,
    /**
     * Add a light piece to the board
     * @return {othello.Board.Builder} the Builder for chaining.
     * @const
     */
    placeLightPiece: function() {
      return placePiece(othello.LightPiece.instance);
    },
    /**
     * Add a dark piece to the board
     * @return {othello.Board.Builder} the Builder for chaining.
     * @const
     */
    placeDarkPiece: function() {
      return placePiece(othello.DarkPiece.instance);
    },
    /**
     * Flip a piece, at the place specified by row and column (set with at)
     * @return {othello.Board.Builder} the Builder for chaining.
     * @const
     */
    flip: function() {
      return placePiece(builder.board[row][column].flip());
    }
  };
};


/**
 * Helper function to create a row.
 * @return {Array.<othello.Piece>} an unpopulated
 *    row in the board.
 * @const
 */
othello.Board.Builder.createRow = function() {
  return _.map(_.range(0, othello.Board.size), function(i) {
    return othello.EmptyPiece.instance;
  });
};


/**
 * Finally, create an Othello Board
 * @return {othello.Board} the board created from this Builder.
 */
othello.Board.Builder.prototype.build = function() {
  // calculate the number of pieces, and pass that through.
  var lightPieces = 0;
  var darkPieces = 0;
  /** @const */ var self = this;
  _.each(_.range(0, self.board.length), function(i) {
    _.each(_.range(0, self.board[0].length), function(j) {
      if (self.board[i][j] === othello.LightPiece.instance) {
        lightPieces++;
      } else if (self.board[i][j] === othello.DarkPiece.instance) {
        darkPieces++;
      }
    });
  });
  return new othello.Board(this.board, lightPieces, darkPieces);
};
