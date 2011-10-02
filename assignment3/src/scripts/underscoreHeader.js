/*
 * Underscore.js doesn't compile, include this "header" so the resulting
*  warnings' noise doesn't bury the real warnings.
 */

/**
 * @const
 * @type {function(*): othello.underscore.header.RichArray}
 */
var _ = _ || function() {};
/** @const */ _.range = _.range || {};
/** @const */ _.zip = _.zip || {};
/** @const */ _.each = _.each || {};
/** @const */ _.map = _.map || {};
/** @const */ _.flatten = _.flatten || {};
/** @const */ _.chain = _.chain || {};
/** @const */ _.value = _.value || {};
/** @const */ _.reject = _.reject || {};

/** @const */ othello.underscore = othello.underscore || {};
/** @const */ othello.underscore.header = othello.underscore.header || {};

/**
 * This isn't a real class, it's just a "proxy" that can tell the compiler
 * about the operations that underscore.js objects support.
 * Not having it causes the compiler to complain about functions that are
 * valid, but can't be verified because underscore.js doesn't compile.
 * @const
 * @constructor
 */
othello.underscore.header.RichArray = function() {};
/** @const */ othello.underscore.header.RichArray.prototype.flatten =
    _.flatten || function() {};
/** @const */ othello.underscore.header.RichArray.prototype.chain =
    _.chain || function() {};
/** @const */ othello.underscore.header.RichArray.prototype.map =
    _.map || function() {};
/** @const */ othello.underscore.header.RichArray.prototype.value =
    _.value || function() {};
/** @const */ othello.underscore.header.RichArray.prototype.reject =
    _.reject || function() {};
/** @const */ othello.underscore.header.RichArray.prototype.each =
    _.each || function() {};
