/**
 * @enum {number}
 * @const
 */
othello.Piece = {
  empty: -1,
  dark: 0,
  light: 1
};



/**
 * A type of piece that can go on a square.
 * We don't actually need a parent class in JavaScript, but
 * it helps for documentation.
 * @interface
 */
othello.Piece = function() {};


/**
 * Flips to the opposite type of piece.
 */
othello.Piece.prototype.flip = function() {};



/**
 * A light piece
 * @constructor
 * @implements {othello.Piece}
 */
othello.LightPiece = function() {};


/**
 * Flips to the opposite type of piece.
 * @return {othello.Piece} a DarkPiece.
 */
othello.LightPiece.prototype.flip = function() {
  return new othello.DarkPiece();
};



/**
 * A dark piece
 * @constructor
 * @implements {othello.Piece}
 */
othello.DarkPiece = function() {};


/**
 * Flips to the opposite type of piece.
 * @return {othello.Piece} a LightPiece.
 */
othello.DarkPiece.prototype.flip = function() {
  return new othello.LightPiece();
};
