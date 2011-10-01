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
      at(3, 3).placeLightMarker().build();
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
      othello.DarkPiece.instance, initialX, initialY, deltaX, deltaY)

  assertEquals(1, toFlip.length);
  /** @const */ var coordinates = toFlip[0];
  assertEquals(3, coordinates.xCoordinate);
  assertEquals(3, coordinates.yCoordinate);
};

BoardTest.prototype.testFindPiecesToFlipLoop = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard();
  _.each(_.range(1, othello.Board.size - 1), function(i) {
    boardBuilder.at(i, 0).placeLightMarker();
  });
  /*
  for (var i = 1; i < othello.Board.size - 1; i++) {
    boardBuilder.at(i, 0).placeLightMarker();
  }
  */
  boardBuilder.at(7, 0).placeDarkMarker();
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

};

BoardTest.prototype.testCorrectDimensions = function() {
  assertEquals(8, othello.Board.size);
};

BoardTest.prototype.testCreateRow = function() {
  /** @const */ var row = othello.Board.Builder.createRow();
  assertEquals(othello.Board.size, row.length);
  for (var i = 0; i < othello.Board.size; i++) {
    assertEquals(othello.EmptyPiece.instance, row[i]);
  }
};


BoardTest.prototype.testInitialGame = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();

  assertEquals(othello.LightPiece.instance, board.pieceAt(3, 3));
  assertEquals(othello.DarkPiece.instance, board.pieceAt(3, 4));
  assertEquals(othello.DarkPiece.instance, board.pieceAt(4, 3));
  assertEquals(othello.LightPiece.instance, board.pieceAt(4, 4));
}

BoardTest.prototype.testBuilderCreation = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
    at(1, 1).placeLightMarker().
    at(3, 5).placeDarkMarker().
    at(6, 7).placeLightMarker().build()

  assertEquals(othello.LightPiece.instance, board.pieceAt(1, 1));
  assertEquals(othello.DarkPiece.instance, board.pieceAt(3, 5));
  assertEquals(othello.LightPiece.instance, board.pieceAt(6, 7));
};

BoardTest.prototype.testBuilderTemplate = function() {
  /** @const */ var first = othello.Board.Builder.initialGame().build();
  /** @const */ var second = othello.Board.Builder.templatedBy(first).
      at(1, 1).placeLightMarker().build();
  
  assertEquals(second.pieceAt(1, 1), othello.LightPiece.instance);
  assertEquals('The original board should be unchanged',
      first.pieceAt(1, 1), othello.EmptyPiece.instance);
};
