var othello = othello || {};



/**
 * Constructor for an Othello board
 * @param {Array.<Array.<othello.Board.Piece>>} board a 2D array
 *     representing the board.
 * @constructor
 * @const
 */
othello.Board = function(board) {
  /** @const */ this.board = board;
};


/**
 * Retrieve the piece at a given location.
 * @param {number} row the row.
 * @param {column} column the column.
 * @return {othello.Board.Piece} the Piece at that location.
 */
othello.Board.prototype.pieceAt = function(row, column) {
  return this.board[row][column];
};


/**
 * @enum {number}
 * @const
 */
othello.Board.Piece = {
  empty: -1,
  dark: 0,
  light: 1
};


/**
 * @const
 * @type {number}
 */
othello.Board.size = 8;



/**
 * Constructor for an Othello board builder
 * @param {Array.<Array.<othello.Board.Piece>>} board the board to start with.
 * @constructor
 * @const
 */
othello.Board.Builder = function(board) {
  this.board = board;
  this.row = 0;
  this.column = 0;
};


/**
 * Named constructor to create an empty board as a Builder
 * @return {othello.Board.Builder} the created Builder.
 * @const
 */
othello.Board.Builder.emptyBoard = function() {
  /** @const */ var board = [];
  for (var i = 0; i < othello.Board.size; i++) {
    board.push(othello.Board.Builder.createRow());
  }

  return new othello.Board.Builder(board);
};


/**
 * Name constructor to create an initial game as a Builder
 * @return {othello.Board.Builder} the created Builder.
 * @const
 */
othello.Board.Builder.initialGame = function() {
  return othello.Board.Builder.emptyBoard().
      at(3, 3).placeLightMarker().
      at(3, 4).placeDarkMarker().
      at(4, 3).placeDarkMarker().
      at(4, 4).placeLightMarker().build();
};



/**
 * Position this.row and this.column
 * @param {number} row the value for the row.
 * @param {number} column the value for the column.
 * @return {othello.Board.Builder} this for chaining.
 * @const
 */
othello.Board.Builder.prototype.at = function(row, column) {
  this.row = row;
  this.column = column;
  return this;
};


/**
 * Add a light marker to the board
 * @return {othello.Board.Builder} this for chaining.
 * @const
 */
othello.Board.Builder.prototype.placeLightMarker = function() {
  this.place(othello.Board.Piece.light);
  return this;
};


/**
 * Add a dark marker to the board
 * @return {othello.Board.Builder} this for chaining.
 * @const
 */
othello.Board.Builder.prototype.placeDarkMarker = function() {
  this.place(othello.Board.Piece.dark);
  return this;
};


/**
 * Add a marker to the board
 * @param {othello.Board.Piece} piece the piece to add.
 * @return {othello.Board.Builder} this for chaining.
 * @const
 */
othello.Board.Builder.prototype.place = function(piece) {
  this.board[this.row][this.column] = piece;
  return this;
};


/**
 * Flip a piece, at the place specified by row and column (set with at)
 * @return {othello.Board.Builder} this for chaining.
 * @const
 */
othello.Board.Builder.prototype.flip = function() {
  /** @const */ var piece = this.board[this.row][this.column];
  if (piece === othello.Board.Piece.dark) {
    this.place(othello.Board.Piece.light);
  } else if (piece === othello.Board.Piece.light) {
    this.place(othello.Board.Piece.dark);
  } else {
    throw new Error('Tried to flip, but no piece in the square');
  }
  return this;
};


/**
 * Helper function to create a row.
 * @return {Array.<othello.Board.Piece>} an unpopulated
 *    row in the board.
 * @const
 */
othello.Board.Builder.createRow = function() {
  /** @const */ var row = [];
  for (var i = 0; i < othello.Board.size; i++) {
    row.push(othello.Board.Piece.empty);
  }
  return row;
};


/**
 * Finally, create an Othello Board
 * @return {othello.Board} the board created from this Builder.
 */
othello.Board.Builder.prototype.build = function() {
  return new othello.Board(this.board);
};
