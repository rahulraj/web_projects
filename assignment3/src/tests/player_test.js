PlayerTest = TestCase('PlayerTest');

PlayerTest.prototype.runOneMoveOnAiPlayer = function(aiPlayer) {
  /** @const */ var board = othello.Board.Builder.emptyBoard().
    at(4, 4).placeLightPiece().
    at(5, 4).placeDarkPiece().build();

  // The AI has one choice: place a dark piece at (3, 4). It should do that.
  /** @const */ var resultBoard = aiPlayer.makeMove(board);

  assertEquals(othello.DarkPiece.instance, resultBoard.pieceAt(3, 4));
  assertEquals(othello.DarkPiece.instance, resultBoard.pieceAt(4, 4));
  assertEquals(othello.DarkPiece.instance, resultBoard.pieceAt(5, 4));

};

PlayerTest.prototype.testRandomPlayerOneMove = function() {
  /** @const */ var randomAi = othello.AiPlayer.createRandomAi(
      othello.DarkPiece.instance);
  this.runOneMoveOnAiPlayer(randomAi);
};

PlayerTest.prototype.testGreedyPlayerOneMove = function() {
  this.runOneMoveOnAiPlayer(
      othello.AiPlayer.createGreedyAi(othello.DarkPiece.instance));
};

PlayerTest.prototype.testGreedyPlayerPicksBetterChoice = function() {
  /** @const */ var boardBuilder = othello.Board.Builder.emptyBoard().
    at(4, 4).placeLightPiece().
    at(5, 4).placeDarkPiece();

  // Place light pieces along the top row.
  _.each(_.range(1, othello.Board.size - 1), function(i) {
    boardBuilder.at(i, 0).placeLightPiece();
  });
  boardBuilder.at(7, 0).placeDarkPiece();

  // Now, the greedy strategy is to place a dark piece at (0, 0)
  
  /** @const */ var greedyAi =
      othello.AiPlayer.createGreedyAi(othello.DarkPiece.instance)
  /** @const */ var newBoard = greedyAi.makeMove(boardBuilder.build());

  assertEquals(othello.DarkPiece.instance, newBoard.pieceAt(0, 0));
};
