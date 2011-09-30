BoardTest = TestCase('BoardTest');

BoardTest.prototype.testValidNextSquare = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
      at(3, 3).placeLightMarker().build();
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
