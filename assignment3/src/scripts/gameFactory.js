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
 * Set up the controller for the game, connecting it to the view and model.
 * @param {othello.GameView} gameView the view.
 * @param {othello.GameModel} gameModel the model.
 * @const
 */
othello.GameFactory.setUpController = function(gameModel, gameView) {
  /** @const */ var isHuman = function(piece) {
    if (piece === othello.LightPiece.instance) {
      return whitePlayer instanceof othello.HumanPlayer; 
    } else if (piece === othello.DarkPiece.instance) {
      return blackPlayer instanceof othello.HumanPlayer; 
    } else {
      throw new Error('Tried to tell if EmptyPiece was human');
    }
  };

  /** @const */ var gameController = new othello.GameController(gameModel,
      gameView, isHuman);

  // jQuery clicks it once initially; ignore that click
  var first = true;
  $('input').live('click', function(event) {
    if (first) {
      first = false; 
      return;
    }
    /** @const */ var value = $(this).val();
    if (value === othello.GameView.undoButtonValue) {
      gameController.onUndoButtonClicked(); 
    } else if (value === othello.GameView.passButtonValue) {
      gameController.onPassButtonClicked(); 
    } else if (value === othello.GameView.redoButtonValue) {
      gameController.onRedoButtonClicked();
    } else if (value === othello.GameView.restartButtonValue) {
      gameController.onRestartButtonClicked(); 
    }
  });

  gameView.addControllerEvents(gameController);
};


/**
 * @const
 * @type {string}
 */
othello.GameFactory.parentElementSelector = 'section';


/**
 * After the start form is filled, wire up the game and start it.
 * @param {string} whitePlayerSelection the input for who should play white.
 * @param {string} blackPlayerSelection the input for who should play black.
 * @const
 */
othello.GameFactory.createGameMvcAndRun =
    function(whitePlayerSelection, blackPlayerSelection) {
  /** @const */ var initialBoard = othello.Board.Builder.initialGame().build();
  /** @const */ var history = new othello.BoardHistory(initialBoard);
  /** @const */ var startingPiece = othello.DarkPiece.instance;
  /** @const */ var gameModel = new othello.GameModel(initialBoard,
      startingPiece, history, 100);

  /** @const */ var whitePlayer = othello.GameFactory.playerFromString(
      gameModel, whitePlayerSelection);

  /** @const */ var blackPlayer = othello.GameFactory.playerFromString(
      gameModel, blackPlayerSelection);


  /** @const */ var initialBoardTableView =
      othello.BoardTableView.of(initialBoard, startingPiece);
  /** @const */ var undoButton = $('<input>', {
      type: 'button', value: othello.GameView.undoButtonValue});
  /** @const */ var passButton = $('<input>', {
      type: 'button', value: othello.GameView.passButtonValue});
  /** @const */ var redoButton = $('<input>', {
      type: 'button', value: othello.GameView.redoButtonValue});
  /** @const */ var restartButton = $('<input>', {
      type: 'button', value: othello.GameView.restartButtonValue});

  /** @const */ var parentElement =
      $(othello.GameFactory.parentElementSelector);
  /** @const */ var gameView = new othello.GameView(initialBoardTableView,
      undoButton, passButton, redoButton, restartButton, parentElement);

  gameModel.addObserver(gameView);
  gameModel.addObserver(whitePlayer);
  gameModel.addObserver(blackPlayer);

  othello.GameFactory.setUpController(gameModel, gameView);

  // all hooked up, now start the game with the initial cascade of events.
  gameModel.publishInitialMessage();
};
