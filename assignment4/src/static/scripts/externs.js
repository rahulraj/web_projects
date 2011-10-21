


/**
 * @const
 * @constructor
 */
var jQueryObject = function() {};
jQueryObject.prototype.append = function(arg) {};
jQueryObject.prototype.bind = function(arg1, arg2) {};


/**
 * @param {*=} opt_arg
 */
jQueryObject.prototype.offset = function(opt_arg) {};
jQueryObject.prototype.live = function(arg1, arg2) {};


/**
 * @param {*=} opt_arg
 */
jQueryObject.prototype.val = function(opt_arg) {};


/**
 * @param {*} arg1
 * @param {*=} opt_arg2
 */
jQueryObject.prototype.attr = function(arg1, opt_arg2) {};


/**
 * @param {*=} opt_arg
 */
jQueryObject.prototype.html = function(opt_arg) {};
jQueryObject.prototype.filter = function(arg1) {};
jQueryObject.prototype.click = function(arg1) {};
jQueryObject.prototype.draggable = function() {};
jQueryObject.prototype.resizable = function() {};
jQueryObject.prototype.show = function() {};
jQueryObject.prototype.hide = function() {};
jQueryObject.prototype.remove = function() {};
jQueryObject.prototype.after = function(arg) {};
jQueryObject.prototype.before = function(arg) {};


/**
 * Extern function for jQuery
 * @param {*} element the first argument.
 * @param {*|null|undefined=} opt_attributes optional attributes.
 * @return {jQueryObject} a jQuery object
 * @const
 */
function $(element, opt_attributes) {}
$.get = function(arg1, arg2) {};
$.post = function(arg1, arg2, arg3) {};



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
Underscore.prototype.detect = function(arg) {};


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
_.keys = function(arg) {};

var JSON = function() {};
JSON.stringify = function(arg) {};
JSON.parse = function(arg) {};
