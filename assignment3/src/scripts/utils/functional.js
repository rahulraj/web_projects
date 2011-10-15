/**
 * Iterate through an array.
 * @param {Array.<*>} array the array to walk.
 * @param {function(*)} g the function to apply.
 */
othello.utils.each = function(array, g) {
  for (var i = 0; i < array.length; i++) {
    /** @const */ var element = array[i];
    g(element);
  }
};


/**
 * Apply a function to every element in the array
 * @param {Array.<*>} array the array to walk.
 * @param {function(*): *} g the function to apply.
 * @return {Array.<*>} the result array.
 */
othello.utils.map = function(array, g) {
  /** @const */ var result = [];
  othello.utils.each(array, function(item) {
    result.push(g(item));
  });
  return result;
};


/**
 * Range function, similar to Python's
 * @param {number} start the first number to start with.
 * @param {number} end the number to finish at.
 * @return {Array.<number>} the array containing the range.
 */
othello.utils.range = function(start, end) {
  /** @const */ var result = [];
  for (var i = 0; i < end; i++) {
    result.push(i);
  }
  return result;
};


/**
 * Similar to Python's zip
 * @param {Array.<*>} first the first array to walk.
 * @param {Array.<*>} second the second array to walk.
 */
othello.utils.zip = function(first, second) {
  return othello.utils.map(othello.utils.range(0, first.length), function(i) {
    return [first[i], second[i]];
  });
};


/**
 * Given an array, applies g to all its elements,
 * then flattens the result.
 * @param {Array.<*>} array the array to walk, containing elements of type A.
 * @param {function(Array.<*>): Array.<*>} g a function that takes
 *     an A and returns an array of B's, for some type B.
 * @return {Array.<*>} an array of B's.
 */
othello.utils.flatMap = function(array, g) {
  /** @const */ var result = [];
  othello.utils.each(array, function(item) {
    /** @const */ var gApplied = g(item);
    othello.utils.each(gApplied, function(gApply) {
      result.push(gApply);
    });
  });
  return result;
};
