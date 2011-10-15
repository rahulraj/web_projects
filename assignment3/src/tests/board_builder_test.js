BoardBuilderTest = TestCase('BoardBuilderTest');


BoardBuilderTest.prototype.testCorrectDimensions = function() {
  assertEquals(8, othello.Board.size);
};

BoardBuilderTest.prototype.testCreateRow = function() {
  /** @const */ var row = othello.Board.Builder.createRow();
  assertEquals(othello.Board.size, row.length);
  othello.utils.each(_.range(0, othello.Board.size), function(i) {
    assertEquals(othello.EmptyPiece.instance, row[i]);
  });
};


BoardBuilderTest.prototype.testInitialGame = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();

  assertEquals(othello.LightPiece.instance, board.pieceAt(3, 3));
  assertEquals(othello.DarkPiece.instance, board.pieceAt(3, 4));
  assertEquals(othello.DarkPiece.instance, board.pieceAt(4, 3));
  assertEquals(othello.LightPiece.instance, board.pieceAt(4, 4));
};

BoardBuilderTest.prototype.testBuilderCreation = function() {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
      at(1, 1).placeLightPiece().
      at(3, 5).placeDarkPiece().
      at(6, 7).placeLightPiece().build();

  assertEquals(othello.LightPiece.instance, board.pieceAt(1, 1));
  assertEquals(othello.DarkPiece.instance, board.pieceAt(3, 5));
  assertEquals(othello.LightPiece.instance, board.pieceAt(6, 7));
};

BoardBuilderTest.prototype.testBuilderTemplate = function() {
  /** @const */ var first = othello.Board.Builder.initialGame().build();
  /** @const */ var second = othello.Board.Builder.templatedBy(first).
      at(1, 1).placeLightPiece().build();

  assertEquals(second.pieceAt(1, 1), othello.LightPiece.instance);
  assertEquals('The original board should be unchanged',
      first.pieceAt(1, 1), othello.EmptyPiece.instance);
};

BoardBuilderTest.prototype.testPieceCount = function() {
  /** @const */ var board = othello.Board.Builder.initialGame().build();

  assertEquals(2, board.getNumberOfDarkPieces());
  assertEquals(2, board.getNumberOfLightPieces());
};
