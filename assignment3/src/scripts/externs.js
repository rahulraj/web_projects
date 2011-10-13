/**
 * @const
 * @constructor
 */
var jQueryObject = function() {};
jQueryObject.prototype.append = function(arg) {};
jQueryObject.prototype.attr = function(arg1, arg2) {};


/**
 * Extern function for jQuery
 * @param {*} element the first argument.
 * @param {*|null|undefined} opt_attributes optional attributes.
 * @return {jQueryObject} a jQuery object
 * @const
 */
function $ (element, opt_attributes) {};


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
function _ (arg1) {};
_.each = function(arg1, arg2) {};
_.map = function(arg1, arg2) {};
_.range = function(arg1, arg2) {};
_.zip = function(arg1, arg2) {};
