


/**
 * Constructor for Othello squares.
 * @param {Option} piece an Option containing a type of piece,
 *     or None if the Square is empty.
 * @constructor
 */
othello.Square = function(piece) {
  /** @const */ this.piece = piece;
};


/**
 * Tell if this square is empty.
 * @return {Boolean} true if this.piece is a None.
 */
othello.Square.prototype.isEmpty = function() {
  return this.piece instanceof othello.utils.None;
};


/**
 * Flips the underlying piece.
 * @return {othello.Square} the square resulting from
 *     calling flip on this Square's underlying piece,
 *     and then wrapping the resulting piece in a new Square.
 */
othello.Square.prototype.flip = function() {
  return new Square(this.piece.map(function(aPiece) {
    return aPiece.flip();
  }));
};
