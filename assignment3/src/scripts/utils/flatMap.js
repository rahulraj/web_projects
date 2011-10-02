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
  _(array).each(function(item) {
    /** @const */ var gApplied = g(item);
    _(gApplied).each(function(gApply) {
      result.push(gApply);
    });
  });
  return result;
};
