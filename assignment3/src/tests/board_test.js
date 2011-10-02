BoardTest = TestCase('BoardTest');

BoardTest.prototype.testValidNextSquare = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();
  /** @const */ var square = board.nextSquare(2, 3, 1, 0).
      getOrElse(null);
  assertEquals(othello.LightPiece.instance, square);
};

BoardTest.prototype.testInvalidNextSquare = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().build();
  /** @const */ var square = board.nextSquare(0, 0, -1, 0).
      getOrElse(null);
  assertNull(square);
};

BoardTest.prototype.testOverlappingPiecePlacementNotValid = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
      at(3, 3).placeLightPiece().build();
  assertFalse(board.placementIsValid(othello.LightPiece.instance, 3, 3));
};

BoardTest.prototype.testPiecePlacementInvalidWithoutAdjacents = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();
  return;
  //assertFalse(board.placementIsValid(othello.LightPiece.instance, 0, 0));
};

BoardTest.prototype.testFindPiecesToFlipSimple = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();
  // simulate a valid first move, placing a dark piece at (2, 3)
  // this should cause the light piece at (3, 3) to flip.
  /** @const */ var initialX = 2;
  /** @const */ var initialY = 3;
  /** @const */ var deltaX = 1;
  /** @const */ var deltaY = 0; // search downwards.
  /** @const */ var toFlip = board.findPiecesToFlip(
      othello.DarkPiece.instance, initialX, initialY, deltaX, deltaY);

  assertEquals(1, toFlip.length);
  /** @const */ var coordinates = toFlip[0];
  assertEquals(3, coordinates.xCoordinate);
  assertEquals(3, coordinates.yCoordinate);
};

BoardTest.prototype.testFindPiecesToFlipLoop = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard();
  _.each(_.range(1, othello.Board.size - 1), function(i) {
    boardBuilder.at(i, 0).placeLightPiece();
  });
  boardBuilder.at(7, 0).placeDarkPiece();
  /** @const */ var board = boardBuilder.build();
  // Now, placing a dark piece at (0, 0) and searching with an xDelta
  // of +1 should result in all 6 of the light pieces flipping.
  /** @const */ var initialX = 0;
  /** @const */ var initialY = 0;
  /** @const */ var deltaX = 1;
  /** @const */ var deltaY = 0;
  /** @const */ var toFlip = board.findPiecesToFlip(
      othello.DarkPiece.instance, initialX, initialY, deltaX, deltaY);
  assertEquals(6, toFlip.length);
};

BoardTest.prototype.testFindPiecesToFlipStopsIfNextToSameColor = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();
  // Suppose black tries the illegal move of placing a piece at (4, 2).
  // If we call findPiecesToFlip with a deltaY of +1, it should see that
  // the immediately adjacent piece is another black piece, and return
  // an empty list.
  /** @const */ var initialX = 4;
  /** @const */ var initialY = 2;
  /** @const */ var deltaX = 0;
  /** @const */ var deltaY = 1;
  /** @const */ var toFlip = board.findPiecesToFlip(
      othello.DarkPiece.instance, initialX, initialY, deltaX, deltaY);
  assertEquals(0, toFlip.length);
};

BoardTest.prototype.testFindPiecesToFlipStopsIfIsolated = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
      at(3, 3).placeLightPiece().
      at(7, 5).placeDarkPiece().build();
  /** @const */ var toFlip = board.findPiecesToFlip(
      othello.DarkPiece.instance, 0, 0, 1, 1);
  assertEquals(0, toFlip.length);
};

BoardTest.prototype.testFindPiecesToFlipStopsIfChainIsBroken = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard();
  _.each(_.range(1, othello.Board.size - 1), function(i) {
    boardBuilder.at(i, 0).placeLightPiece();
  });
  boardBuilder.at(7, 0).placeDarkPiece();
  // This time, there is a space in the middle
  boardBuilder.at(3, 0).place(othello.EmptyPiece.instance);
  /** @const */ var board = boardBuilder.build();
  /** @const */ var toFlip = board.findPiecesToFlip(
      othello.DarkPiece.instance, 0, 0, 1, 0);
  assertEquals(0, toFlip.length);
};

BoardTest.prototype.testZip = function() {
  /** @const */ var first = [-1, 0, 1];
  /** @const */ var second = [-1, 0, 1];
  /** @const */ var result = _.zip(first, second);
};

BoardTest.prototype.testDeltas = function() {
  /** @const */ var deltas = othello.Board.deltas();
  assertEquals(8, deltas.length);

  /** @const */ var dxIsNegOne = _(deltas).chain().filter(function(delta) {
    return delta[0] === -1;
  }).sortBy(function(delta) {
    return delta[1];
  }).value();

  assertEquals(3, dxIsNegOne.length);
  assertEquals(-1, dxIsNegOne[0][1]);
  assertEquals(0, dxIsNegOne[1][1]);
  assertEquals(1, dxIsNegOne[2][1]);

  /** @const */ var dxIsZero = _(deltas).chain().filter(function(delta) {
    return delta[0] === 0; 
  }).sortBy(function(delta) {
    return delta[1];
  }).value();

  assertEquals(2, dxIsZero.length);
  assertEquals(-1, dxIsZero[0][1]);
  assertEquals(1, dxIsZero[1][1]);

  /** @const */ var dxIsOne = _(deltas).chain().filter(function(delta) {
    return delta[0] === 1;
  }).sortBy(function(delta) {
    return delta[1];
  }).value();

  assertEquals(3, dxIsOne.length);
  assertEquals(-1, dxIsOne[0][1]);
  assertEquals(0, dxIsOne[1][1]);
  assertEquals(1, dxIsOne[2][1]);
};

BoardTest.prototype.testFindAllPiecesToFlip = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard();
  _.each(_.range(1, othello.Board.size - 1), function(i) {
    boardBuilder.at(i, 0) .placeLightPiece().
        at(0, i).placeLightPiece();
  });
  boardBuilder.at(7, 0).placeDarkPiece().
      at(0, 7).placeDarkPiece();
  /** @const */ var board = boardBuilder.build();
  /** @const */ var toFlip = board.findAllPiecesToFlip(
      othello.DarkPiece.instance, 0, 0);

  assertEquals(12, toFlip.length);
};

BoardTest.prototype.testFindPossibleMovesInitialGame = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();
  /** @const */ var moves = board.findPossibleMoves(othello.DarkPiece.instance);
  // moves should contain (3, 2), (2, 3), (4, 5), and (5, 4), in any order.
  assertEquals(4, moves.length);

  /** @const */ var sortedMoves = _(moves).sortBy(function(move) {
    return move.getX(); 
  });

  assertTrue((new othello.Point(2, 3)).equals(sortedMoves[0]));
  assertTrue((new othello.Point(3, 2)).equals(sortedMoves[1]));
  assertTrue((new othello.Point(4, 5)).equals(sortedMoves[2]));
  assertTrue((new othello.Point(5, 4)).equals(sortedMoves[3]));
};

BoardTest.prototype.testFindPossibleMovesNoMoves = function() {
  /** @const */ var emptyBoard = othello.Board.Builder.emptyBoard().build();
  /** @const */ var moves = emptyBoard.findPossibleMoves(othello.DarkPiece.instance);

  assertEquals(0, moves.length);
};
