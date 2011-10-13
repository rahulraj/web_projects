/** @const */ othello.GameFactory = {};


/**
 * After the start form is filled, wire up the application.
 * @param {string} whitePlayerSelection the input for who should play white.
 * @param {string} blackPlayerSelection the input for who should play black.
 * @const
 */
othello.GameFactory.createGameMvcAndRun =
    function(whitePlayerSelection, blackPlayerSelection) {

  /** @const */ var initialBoard = othello.Board.Builder.initialGame().build();
  /** @const */ var startingPiece = othello.DarkPiece.instance;
  /** @const */ var gameModel = new othello.GameModel(initialBoard,
      startingPiece);

  /** @const */ var whitePlayer;
  switch (whitePlayerSelection) {
    case 'whiteHuman':
      whitePlayer = new othello.HumanPlayer(othello.LightPiece.instance);
      break;
    case 'whiteEasyAi':
      whitePlayer = othello.AiPlayer.createRandomAi(
          gameModel, othello.LightPiece.instance);
      break;
    case 'whiteMediumAi':
      whitePlayer = othello.AiPlayer.createGreedyAi(
          gameModel, othello.LightPiece.instance);
      break;
    default:
      throw new Error('Invalid player choice');
  }

  /** @const */ var blackPlayer;
  switch (blackPlayerSelection) {
    case 'blackHuman':
      blackPlayer = new othello.HumanPlayer(othello.DarkPiece.instance);
      break;
    case 'blackEasyAi':
      blackPlayer = othello.AiPlayer.createRandomAi(
          gameModel, othello.DarkPiece.instance);
      break;
    case 'blackMediumAi':
      blackPlayer = othello.AiPlayer.createGreedyAi(
          gameModel, othello.DarkPiece.instance);
      break;
    default:
      throw new Error('Invalid player choice');
  }

  /** @const */ var undoStack = new othello.UndoStack();

  /** @const */ var initialBoardTableView =
      othello.BoardTableView.of(initialBoard, startingPiece);
  /** @const */ var undoButton = $('<input>', {
    type: 'button', value: 'Undo Last Move'});
  /** @const */ var parentElement = $('section');
  /** @const */ var gameView = new othello.GameView(
      initialBoardTableView, undoButton, parentElement);

  gameModel.addObserver(undoStack);
  gameModel.addObserver(gameView);
  gameModel.addObserver(whitePlayer);
  gameModel.addObserver(blackPlayer);

  /** @const */ var gameController = new othello.GameController(gameModel,
                                                                gameView);
  gameView.addControllerEvents(gameController);

  // all hooked up, now start the game with the initial cascade of events.
  gameModel.notifyObservers();
};
