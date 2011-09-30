

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
 * @const
 */
othello.Piece = function() {};


/**
 * Flips to the opposite type of piece.
 * @const
 */
othello.Piece.prototype.flip = function() {};



/**
 * A light piece
 * @constructor
 * @implements {othello.Piece}
 * @const
 */
othello.LightPiece = function() {};


/**
 * The pieces are stateless, so they can share an instance.
 * @const
 */
othello.LightPiece.instance = new othello.LightPiece();


/**
 * Flips to the opposite type of piece.
 * @return {othello.Piece} a DarkPiece.
 * @const
 */
othello.LightPiece.prototype.flip = function() {
  return othello.DarkPiece.instance;
};



/**
 * A dark piece
 * @constructor
 * @implements {othello.Piece}
 * @const
 */
othello.DarkPiece = function() {};


/**
 * Share an instance.
 * @const
 */
othello.DarkPiece.instance = new othello.DarkPiece();


/**
 * Flips to the opposite type of piece.
 * @return {othello.Piece} a LightPiece.
 * @const
 */
othello.DarkPiece.prototype.flip = function() {
  return othello.LightPiece.instance;
};


/**
 * An empty square (no piece).
 * @constructor
 * @implements {Othello.Piece}
 * @const
 */
othello.EmptyPiece = function() {};


/**
 * Share an instance.
 * @const
 */
othello.EmptyPiece.instance = new othello.EmptyPiece();


/**
 * Flipping doesn't make sense when the square's empty.
 */
othello.EmptyPiece.prototype.flip = function() {
  throw new Error("Can't flip where there's no piece");
};
