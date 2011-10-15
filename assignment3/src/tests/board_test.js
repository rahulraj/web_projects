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
  assertEquals(3, coordinates.getX());
  assertEquals(3, coordinates.getY());
};

BoardTest.prototype.testFindPiecesToFlipLoop = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard();
  othello.utils.each(_.range(1, othello.Board.size - 1), function(i) {
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
  othello.utils.each(_.range(1, othello.Board.size - 1), function(i) {
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
  othello.utils.each(_.range(1, othello.Board.size - 1), function(i) {
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

BoardTest.prototype.createAllWhitePiecesBoard = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard();

  othello.utils.each(_.range(0, othello.Board.size), function(i) {
    othello.utils.each(_.range(0, othello.Board.size), function(j) {
      boardBuilder.at(i, j).placeLightPiece();
    });
  });
  return boardBuilder.build();
};

BoardTest.prototype.testNoMovesOnFilledBoard = function() {
  /** @const */ var board = this.createAllWhitePiecesBoard();

  /** @const */ var lightMoves = board.findPossibleMoves(othello.LightPiece.instance);
  assertEquals(0, lightMoves.length);

  /** @const */ var darkMoves = board.findPossibleMoves(othello.DarkPiece.instance);
  assertEquals(0, darkMoves.length);
};

BoardTest.prototype.createVlasakovaSchotteBoard = function() {
  /** @const */ var allWhiteBoard = this.createAllWhitePiecesBoard();
  
  /** @const */ var vlasakovaSchotteBoard = 
      othello.Board.Builder.templatedBy(allWhiteBoard).
        at(7, 5).placeDarkPiece().
        at(7, 3).place(othello.EmptyPiece.instance).
        at(7, 4).place(othello.EmptyPiece.instance).
        at(7, 6).place(othello.EmptyPiece.instance).
        at(6, 5).place(othello.EmptyPiece.instance).
        at(6, 4).place(othello.EmptyPiece.instance).build();
  return vlasakovaSchotteBoard;
};

BoardTest.prototype.testNoMovesVlasakovaSchotte2011Game = function() {
  // Tests the position in the Vlasakova-Schotte game from the European
  // Grand Prix Prague 2011. See the Reversi Wikipedia article for an image.
  // This is an example of a game that ends even though the board isn't full.
  
  // There is a dark piece at (7, 5). There are empty squares at
  // (7, 3), (7, 4), (7, 6), (6, 5), and (6, 4). All other squares
  // have white pieces. 
  /** @const */ var vlasakovaSchotteBoard = this.createVlasakovaSchotteBoard();

  /** @const */ var lightMoves =
      vlasakovaSchotteBoard.findPossibleMoves(othello.LightPiece.instance);
  assertEquals(0, lightMoves.length);

  /** @const */ var darkMoves =
      vlasakovaSchotteBoard.findPossibleMoves(othello.DarkPiece.instance);
  assertEquals(0, darkMoves.length);
};

BoardTest.prototype.testFirstMove = function() {
  /** @const */ var initialBoard = othello.Board.Builder.initialGame().build();

  // Try placing a black piece at (3, 2). The white piece at (3, 3) should
  // flip, and all remaining pieces should be the same. Also, board should
  // not be mutated.
  /** @const */ var nextBoard = initialBoard.makeMove(
      othello.DarkPiece.instance, 3, 2);

  othello.utils.each(_.range(0, othello.Board.size), function(i) {
    othello.utils.each(_.range(0, othello.Board.size), function(j) {
      if (i === 3 && j === 2) {
        assertFalse(initialBoard.isOccupiedAt(i, j));
        assertEquals(othello.DarkPiece.instance, nextBoard.pieceAt(i, j));
      } else if (i === 3 && j === 3) {
        assertEquals(othello.LightPiece.instance, initialBoard.pieceAt(i, j));
        assertEquals(othello.DarkPiece.instance, nextBoard.pieceAt(i, j));
      } else {
        assertEquals(initialBoard.pieceAt(i, j), nextBoard.pieceAt(i, j));
      }
    });
  });
};

BoardTest.prototype.testMakeMoveThrowsOnInvalidMove = function() {
  /** @const */ var initialBoard = othello.Board.Builder.initialGame().build();

  try {
    initialBoard.makeMove(othello.DarkPiece.instance, 3, 3);
    fail();
  } catch (expectedInvalidMoveError) {}
};

BoardTest.prototype.testMakeMoveOn2Chain = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
      at(4, 1).placeLightPiece().
      at(3, 2).placeLightPiece().
      at(2, 3).placeDarkPiece().build();

  /** @const */ var next = board.makeMove(othello.DarkPiece.instance, 5, 0);

  assertEquals(othello.DarkPiece.instance, next.pieceAt(4, 1));
  assertEquals(othello.DarkPiece.instance, next.pieceAt(3, 2));
};

BoardTest.prototype.testMakeMoveOnFullyPopulatedBoard = function() {
  // position from an actual game from manual testing. I encountered a bug,
  // so this is part of the method to pinpoint it.
  /** @const */ var board = othello.Board.Builder.emptyBoard().
      at(5, 0).placeDarkPiece().at(4, 1).placeLightPiece().
      at(5, 1).placeDarkPiece().at(5, 2).placeLightPiece().
      at(2, 2).placeLightPiece().at(3, 2).placeLightPiece().
      at(4, 2).placeLightPiece().at(5, 2).placeDarkPiece().
      at(2, 3).placeDarkPiece().at(3, 3).placeDarkPiece().
      at(4, 3).placeDarkPiece().at(3, 4).placeDarkPiece().
      at(4, 4).placeLightPiece().build();

  /** @const */ var  next = board.makeMove(othello.LightPiece.instance, 3, 5);

  assertEquals(othello.LightPiece.instance, next.pieceAt(3, 3));
  assertEquals(othello.LightPiece.instance, next.pieceAt(3, 4));
};
