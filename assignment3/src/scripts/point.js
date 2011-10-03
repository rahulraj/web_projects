


/**
 * Constructor for Point, a simple data object with x and y coordinates.
 * @param {number} xCoordinate the x coordinate.
 * @param {number} yCoordinate the y coordinate.
 * @constructor
 * @const
 */
othello.Point = function(xCoordinate, yCoordinate) {
  /** @const */ this.xCoordinate = xCoordinate;
  /** @const */ this.yCoordinate = yCoordinate;
};


/**
 * Getter for xCoordinate.
 * @return {number} this.xCoordinate.
 */
othello.Point.prototype.getX = function() {
  return this.xCoordinate;
};


/**
 * Getter for yCoordinate.
 * @return {number} this.yCoordinate.
 */
othello.Point.prototype.getY = function() {
  return this.yCoordinate;
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
  return this.xCoordinate === other.getX() &&
         this.yCoordinate === other.getY();
};
