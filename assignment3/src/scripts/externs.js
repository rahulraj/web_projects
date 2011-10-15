


/**
 * @const
 * @constructor
 */
var jQueryObject = function() {};
jQueryObject.prototype.append = function(arg) {};
jQueryObject.prototype.live = function(arg1, arg2) {};
jQueryObject.prototype.val = function() {};


//jQueryObject.prototype.attr = function(arg1) {}
/**
 * @param {*} arg1
 * @param {*=} opt_arg2
 */
jQueryObject.prototype.attr = function(arg1, opt_arg2) {};
jQueryObject.prototype.html = function(arg1) {};
jQueryObject.prototype.html = function(arg1, arg2) {};
jQueryObject.prototype.filter = function(arg1) {};
jQueryObject.prototype.click = function(arg1) {};


/**
 * Extern function for jQuery
 * @param {*} element the first argument.
 * @param {*|null|undefined=} opt_attributes optional attributes.
 * @return {jQueryObject} a jQuery object
 * @const
 */
function $(element, opt_attributes) {}



/**
 * @const
 * @constructor
 */
var Underscore = function() {};
Underscore.prototype.each = function(arg) {};
Underscore.prototype.map = function(arg) {};
Underscore.prototype.reduce = function(arg1, arg2) {};
Underscore.prototype.filter = function(arg) {};
Underscore.prototype.reject = function(arg) {};


/**
 * Extern for underscore.js
 * @param {*} arg1 the first argument.
 * @return {Underscore} an underscore-enhanced list.
 */
function _(arg1) {}
_.each = function(arg1, arg2) {};
_.map = function(arg1, arg2) {};
_.range = function(arg1, arg2) {};
_.zip = function(arg1, arg2) {};
