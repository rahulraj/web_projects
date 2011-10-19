


/**
 * An Option type, to use instead of null.
 * It wraps a type A, right now there's no way to
 * tell this to the compiler.
 * @interface
 */
networkStickies.utils.Option = function() {};


/**
 * If there is a value inside this option, apply the given function to it.
 * @param {function(*): *} g the function to call.
 *     The first * should be of type A, the second *
 *     should be of a type B which may or may not be A.
 * @return {networkStickies.utils.Option} the resulting Option.
 */
networkStickies.utils.Option.prototype.map = function(g) {};


/**
 * If there is a value inside this option, apply the given function to it,
 * then flatten the nested Options.
 * @param {function(*): networkStickies.utils.Option} g the function to call.
 *     The * should be A. The outputted Option can wrap any type.
 * @return {networkStickies.utils.Option} the resulting Option.
 */
networkStickies.utils.Option.prototype.flatMap = function(g) {};


/**
 * Get the value, or a default value if it does not exist.
 * @param {*} elseValue the value to return if this is None.
 * @return {*} one of the two values.
 */
networkStickies.utils.Option.prototype.getOrElse = function(elseValue) {};



/**
 * Some, the subclass of Option that does contain a value.
 * @param {*} value the value inside the Some.
 * @constructor
 * @implements {networkStickies.utils.Option}
 */
networkStickies.utils.Some = function(value) {
  /** @const */ this.value = value;
};


/**
 * Since there is a value inside the some, call the function.
 * @param {function(*): *} g the function to call.
 *     The first * should be of type A, the second *
 *     should be of a type B which may or may not be A.
 * @return {networkStickies.utils.Some} the new Some value after applying the function.
 */
networkStickies.utils.Some.prototype.map = function(g) {
  return new networkStickies.utils.Some(g(this.value));
};


/**
 * Apply the given function to this.value
 * @param {function(*): networkStickies.utils.Option} g the function to call.
 *     The * should be A. The outputted Option can wrap any type.
 * @return {networkStickies.utils.Option} the result of applying the function,
 *     note that it is Option.<B>, not Option.<Option.<B>>.
 */
networkStickies.utils.Some.prototype.flatMap = function(g) {
  return g(this.value);
};


/**
 * For Some, getOrElse should ignore the input and return this.value
 * @param {*} unused_elseValue the alternate value, not used.
 * @return {*} this.value, because it exists.
 */
networkStickies.utils.Some.prototype.getOrElse = function(unused_elseValue) {
  return this.value;
};



/**
 * None, the subclass of Option that represents the absence of a value
 * @constructor
 * @implements {networkStickies.utils.Option}
 */
networkStickies.utils.None = function() {};


/**
 * None is stateless, so share an instance.
 * @const
 */
networkStickies.utils.None.instance = new networkStickies.utils.None();


/**
 * Since this is None, propagate the None.
 * @param {function(*): *} unused_g the function passed in,
 *     but not actually called.
 * @return {networkStickies.utils.None} the None, propagated through.
 */
networkStickies.utils.None.prototype.map = function(unused_g) {
  return this;
};


/**
 * Since this is None, propagate the None.
 * @param {function(*): networkStickies.utils.Option} unused_g the function passed in,
 *     but not actually called.
 * @return {networkStickies.utils.None} the None, propagated through.
 */
networkStickies.utils.None.prototype.flatMap = function(unused_g) {
  return this;
};


/**
 * For None, getOrElse should return the given value.
 * @param {*} elseValue the alternate value, which will be used.
 * @return {*} the inputted value.
 */
networkStickies.utils.None.prototype.getOrElse = function(elseValue) {
  return elseValue;
};
