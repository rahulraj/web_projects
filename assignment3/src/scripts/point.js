


/**
 * Constructor for Point, a simple data object with x and y coordinates.
 * Representation Invariant: Immutable
 * @param {number} xCoordinate the x coordinate.
 * @param {number} yCoordinate the y coordinate.
 * @constructor
 * @const
 */
othello.Point = function(xCoordinate, yCoordinate) {
  /**
   * Getter for xCoordinate.
   * @return {number} this.xCoordinate.
   * @const
   */
  this.getX = function() {
    return xCoordinate;
  };


  /**
   * Getter for yCoordinate.
   * @return {number} this.yCoordinate.
   */
  this.getY = function() {
    return yCoordinate;
  }
};


/**
 * Compare equality, for testing.
 * @param {*} other the object to test against.
 * @return {boolean} true if this Point is the same as the other one.
 */
othello.Point.prototype.equals = function(other) {
  if (!(other instanceof othello.Point)) {
    return false;
  }
  return this.getX() === other.getX() &&
         this.getY() === other.getY();
};
