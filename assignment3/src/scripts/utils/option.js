


/**
 * An Option type, to use instead of null.
 * It wraps a type A, right now there's no way to
 * tell this to the compiler.
 * @interface
 */
othello.utils.Option = function() {};


/**
 * If there is a value inside this option, apply the given function to it.
 * @param {function(*, *)} g the function to call.
 *     The first * should be of type A, the second *
 *     should be of a type B which may or may not be A.
 */
othello.utils.Option.prototype.map = function(g) {};


/**
 * If there is a value inside this option, apply the given function to it,
 * then flatten the nested Options.
 * @param {function(*, othello.utils.Option)} g the function to call.
 *     The * should be A. The outputted Option can wrap any type.
 */
othello.utils.Option.prototype.flatMap = function(g) {};



/**
 * Some, the subclass of Option that does contain a value.
 * @param {*} value the value inside the Some.
 * @constructor
 * @implements {Option}
 */
othello.utils.Some = function(value) {
  /** @const */ this.value = value;
};


/**
 * Since there is a value inside the some, call the function.
 * @param {function(*, *)} g the function to call.
 *     The first * should be of type A, the second *
 *     should be of a type B which may or may not be A.
 * @return {othello.utils.Some} the new Some value after applying the function.
 */
othello.utils.Some.prototype.map = function(g) {
  return new Some(g(this.value));
};


/**
 * Apply the given function to this.value
 * @param {function(*, othello.utils.Option)} g the function to call.
 *     The * should be A. The outputted Option can wrap any type.
 * @return {othello.utils.Some} the result of applying the function,
 *     note that it is Option.<B>, not Option.<Option.<B>>.
 */
othello.utils.Some.prototype.flatMap = function(g) {
  return g(this.value);
};



/**
 * None, the subclass of Option that represents the absence of a value
 * @constructor
 * @implements {othello.utils.Option}
 */
othello.utils.None = function() {};


/**
 * Since this is None, propagate the None.
 * @param {function(*, *)} unused_g the function passed in,
 *     but not actually called.
 * @return {othello.utils.None} the None, propagated through.
 */
othello.utils.None.prototype.map = function(unused_g) {
  return this;
};


/**
 * Since this is None, propagate the None.
 * @param {function(*, *)} unused_g the function passed in,
 *     but not actually called.
 * @return {othello.utils.None} the None, propagated through.
 */
othello.utils.None.prototype.flatMap = function(unused_g) {
  return this;
};
