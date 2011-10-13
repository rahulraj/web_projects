/**
 * After the start form is filled, wire up the application.
 * @param {string} whitePlayerSelection the input for who should play white.
 * @param {string} blackPlayerSelection the input for who should play black.
 */
othello.GameFactory.createGameMvcAndRun =
    function(whitePlayerSelection, blackPlayerSelection) {
  /** @const */ var whitePlayer;
  switch (whitePlayerSelection) {
    case "whiteHuman":
      whitePlayer = new othello.HumanPlayer(othello.LightPiece.instance);
      break;
    case "whiteEasyAi":
      whitePlayer = othello.AiPlayer.createRandomAi(
          othello.LightPiece.instance);
      break;
    case "whiteMediumAi":
      whitePlayer = othello.AiPlayer.createGreedyAi(
          othello.LightPiece.instance);
      break;
    default:
      throw new Error("Invalid player choice");
  }

  /** @const */ var blackPlayer;
  switch (blackPlayerSelection) {
    case "blackHuman":
      blackPlayer = new othello.HumanPlayer(othello.DarkPiece.instance);
      break;
    case "blackEasyAi":
      blackPlayer = othello.AiPlayer.createRandomAi(
          othello.DarkPiece.instance);
      break;
    case "blackMediumAi":
      blackPlayer = othello.AiPlayer.createGreedyAi(
          othello.DarkPiece.instance);
      break;
    default:
      throw new Error("Invalid player choice");
  }

  /** @const */ var undoStack = new othello.UndoStack();

  /** @const */ var initialBoard = othello.Board.Builder.initialGame().build(); 
  /** @const */ var startingPiece = othello.DarkPiece.instance;

  /** @const */ var initialBoardTableView =
      othello.BoardTableView.of(initialBoard, startingPiece);
  /** @const */ var undoButton = $('<input>', {
      type: 'button', value: 'Undo Last Move'}); 
  /** @const */ var parentElement = $('section');
  /** @const */ var gameView = new othello.GameView(
      initialBoardTableView, undoButton, parentElement);

  /** @const */ var gameModel = new othello.GameModel(initialBoard,
      startingPiece);
  gameModel.addObserver(undoStack);
  gameModel.addObserver(gameView);
  gameModel.addObserver(whitePlayer);
  gameModel.addObserver(blackPlayer);

  /** @const */ var gameController = new othello.GameController(gameModel,
                                                                GameView)
  gameView.addControllerEvents(gameController);

  // all hooked up, now start the game with the initial cascade of events.
  gameModel.notifyObservers();
};
