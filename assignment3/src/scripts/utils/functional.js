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
}


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
