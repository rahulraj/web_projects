MainGameLoopTest = AsyncTestCase('MainGameLoopTest');

MainGameLoopTest.SlowAiPlayer = function(player) {
  // Simulate a human player, who can't move until the user provides input.
  /** @const */ this.player = player;
  this.ready = false;
};

MainGameLoopTest.SlowAiPlayer.prototype.getPiece = function() {
  return this.player.getPiece();
};

MainGameLoopTest.SlowAiPlayer.prototype.readyToMove = function() {
  // delay every other time this player is asked to move  
  this.ready = !(this.ready);
  return this.ready;
};

MainGameLoopTest.SlowAiPlayer.prototype.makeMove = function(board) {
  return this.player.makeMove(board);
};

MainGameLoopTest.StubPlayer = function(piece, moves) {
  /** @const */ this.piece = piece;
  /** @const */ this.moves = moves;
  this.moveIndex = 0;
};

MainGameLoopTest.StubPlayer.prototype.getPiece = function() {
  return this.piece;
};

MainGameLoopTest.StubPlayer.prototype.readyToMove = function() {
  return this.moveIndex < this.moves.length;
};

MainGameLoopTest.StubPlayer.prototype.makeMove = function(board) {
  /** @const */ var move = this.moves[this.moveIndex];
  /** @const */ var result =
      board.makeMove(this.piece, move.getX(), move.getY());
  this.moveIndex++;
  return new othello.utils.Some(result);
};


MainGameLoopTest.prototype.testFullAiGame = function(queue) {
  var gameEnded = false;

  queue.call('Start the game', function(callbacks) {
    /** @const */ var whitePlayer =
        othello.AiPlayer.createGreedyAi(othello.LightPiece.instance) ; 
    /** @const */ var blackPlayer =
        othello.AiPlayer.createGreedyAi(othello.DarkPiece.instance) ; 
    /** @const */ var board = othello.Board.Builder.initialGame().build();

    /** @const */ var onLoopFinish = callbacks.add(function(board) {
      assertFalse(board.canMove(othello.LightPiece.instance));
      assertFalse(board.canMove(othello.DarkPiece.instance));
      gameEnded = true;
    });

    /** @const */ var loop = new othello.MainGameLoop(whitePlayer, blackPlayer,
        onLoopFinish);

    loop.run(board, blackPlayer);
  });

  queue.call('Verify end of game', function() {
    assertTrue(gameEnded);
  });
};

MainGameLoopTest.prototype.testHumanVsAiGame = function(queue) {
  var gameEnded = false;

  queue.call('Start the game', function(callbacks) {
    /** @const */ var whitePlayer =
        othello.AiPlayer.createGreedyAi(othello.LightPiece.instance); 
    /** @const */ var blackPlayerHelper =
        othello.AiPlayer.createGreedyAi(othello.DarkPiece.instance);
    /** @const */ var blackPlayer =
        new MainGameLoopTest.SlowAiPlayer(blackPlayerHelper);
    /** @const */ var board = othello.Board.Builder.initialGame().build();

    /** @const */ var onLoopFinish = callbacks.add(function(board) {
      assertFalse(board.canMove(othello.LightPiece.instance));
      assertFalse(board.canMove(othello.DarkPiece.instance));
      gameEnded = true;
    });

    /** @const */ var loop =
        new othello.MainGameLoop(whitePlayer, blackPlayer, onLoopFinish, 1);

    loop.run(board, blackPlayer);
  });

  queue.call('Verify end of game', function() {
    assertTrue(gameEnded);
  });
};

MainGameLoopTest.prototype.testHumanVsHumanGame = function(queue) {
  var gameEnded = false;

  queue.call('Start the game', function(callbacks) {
    /** @const */ var whitePlayerHelper =
        othello.AiPlayer.createGreedyAi(othello.LightPiece.instance); 
    /** @const */ var whitePlayer =
        new MainGameLoopTest.SlowAiPlayer(whitePlayerHelper);
    /** @const */ var blackPlayerHelper =
        othello.AiPlayer.createGreedyAi(othello.DarkPiece.instance);
    /** @const */ var blackPlayer =
        new MainGameLoopTest.SlowAiPlayer(blackPlayerHelper);
    /** @const */ var board = othello.Board.Builder.initialGame().build();

    /** @const */ var onLoopFinish = callbacks.add(function(board) {
      assertFalse(board.canMove(othello.LightPiece.instance));
      assertFalse(board.canMove(othello.DarkPiece.instance));
      gameEnded = true;
    });

    /** @const */ var loop =
        new othello.MainGameLoop(whitePlayer, blackPlayer, onLoopFinish, 1);

    loop.run(board, blackPlayer);
  });

  queue.call('Verify end of game', function() {
    assertTrue(gameEnded);
  });
};
