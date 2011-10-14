/** @const */ othello.GameFactory = {};

/**
 * Helper method to take a user choice and create the appropriate player.
 * @param {othello.GameModel} gameModel the model.
 * @param {string} input the user input.
 */
othello.GameFactory.playerFromString = function(gameModel, input) {
  /** @const */ var size = 'white'.length; // 'black'.length is the same
  /** @const */ var color = input.slice(0, size);
  /** @const */ var piece;
  if (color === 'white') {
    piece = othello.LightPiece.instance; 
  } else {
    piece = othello.DarkPiece.instance; 
  }
  /** @const */ var description = input.slice(size);
  switch (description) {
    case othello.PlayerFieldset.humanButtonId:
      return new othello.HumanPlayer(piece);
    case othello.PlayerFieldset.easyAiButtonId:
      return othello.AiPlayer.createRandomAi(gameModel, piece);
    case othello.PlayerFieldset.mediumAiButtonId:
      return othello.AiPlayer.createGreedyAi(gameModel, piece);
    default:
      throw new Error('Invalid player choice');
  }
};


/**
 * After the start form is filled, wire up the game and start it.
 * @param {string} whitePlayerSelection the input for who should play white.
 * @param {string} blackPlayerSelection the input for who should play black.
 * @const
 */
othello.GameFactory.createGameMvcAndRun =
    function(whitePlayerSelection, blackPlayerSelection) {
  /** @const */ var undoStack = new othello.UndoStack();

  /** @const */ var initialBoard = othello.Board.Builder.initialGame().build();
  /** @const */ var startingPiece = othello.DarkPiece.instance;
  /** @const */ var gameModel = new othello.GameModel(initialBoard,
      startingPiece, undoStack, 100);

  /** @const */ var whitePlayer = othello.GameFactory.playerFromString(
      gameModel, whitePlayerSelection);

  /** @const */ var blackPlayer = othello.GameFactory.playerFromString(
      gameModel, blackPlayerSelection);


  /** @const */ var initialBoardTableView =
      othello.BoardTableView.of(initialBoard, startingPiece);
  /** @const */ var undoButton = $('<input>', {
      type: 'button', value: 'Undo Last Move'});
  /** @const */ var passButton = $('<input>', {
      type: 'button', value: 'Pass'});

  /** @const */ var parentElement = $('section');
  /** @const */ var gameView = new othello.GameView(
      initialBoardTableView, undoButton, passButton, parentElement);

  gameModel.addObserver(gameView);
  gameModel.addObserver(whitePlayer);
  gameModel.addObserver(blackPlayer);

  /** @const */ var gameController = new othello.GameController(gameModel,
      gameView);

  // jQuery clicks it once initially; ignore that click
  var first = true;
  $('input').live('click', function(event) {
    if (first) {
      first = false; 
      return;
    }
    if ($(this).val() === 'Undo Last Move') {
      gameController.onUndoButtonClicked(); 
    } else {
      gameController.onPassButtonClicked(); 
    }
  });

  gameView.addControllerEvents(gameController);

  // all hooked up, now start the game with the initial cascade of events.
  gameModel.publishInitialMessage();
};
