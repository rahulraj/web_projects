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
