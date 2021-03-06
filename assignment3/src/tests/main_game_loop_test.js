MainGameLoopTest = AsyncTestCase('MainGameLoopTest');

MainGameLoopTest.SlowAiPlayer = function(player) {
  // Simulate a human player, who can't move until the user provides input.
  /** @const */ this.player = player;
  this.ready = false;
  this.numberOfMoves = 0;
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
  this.numberOfMoves++;
  return this.player.makeMove(board);
};


MainGameLoopTest.prototype.disabled_testFullAiGame = function(queue) {
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

/** @const */ MainGameLoopTest.yieldInterval = 0.00001;

MainGameLoopTest.prototype.disabled_testHumanVsAiGame = function(queue) {
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
        new othello.MainGameLoop(whitePlayer, blackPlayer, onLoopFinish,
                                 MainGameLoopTest.yieldInterval);

    loop.run(board, blackPlayer);
  });

  queue.call('Verify end of game', function() {
    assertTrue(gameEnded);
  });
};

MainGameLoopTest.prototype.disabled_testHumanVsHumanGame = function(queue) {
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

      /** @const */ var moveDifference = Math.abs(whitePlayer.numberOfMoves -
          blackPlayer.numberOfMoves)
      /** @const */ var message = 'Players should have alternated turns. ' +
        'moveDifference is: ' + moveDifference
      assertTrue(message, moveDifference <= 1);

      gameEnded = true;
    });

    /** @const */ var loop =
        new othello.MainGameLoop(whitePlayer, blackPlayer, onLoopFinish,
                                 MainGameLoopTest.yieldInterval);

    loop.run(board, blackPlayer);
  });

  queue.call('Verify end of game', function() {
    assertTrue(gameEnded);
  });
};
