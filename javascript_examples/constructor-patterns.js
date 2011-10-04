// consequences of forgetting to use new
var Point = function (x, y) {
    this.x = function () {return x;}
    this.y = function () {return y;}
}
x = 3;
var p = Point(1, 2);
p.x(); // undefined: x is not a property of p
x; // ouch: setting this.x has modified the global x

// mitigation for forgetting to include new keyword in call
var Point = function (x, y) {
    // if called without new, test will fail and function will be called again
    if (!(this instanceof Point)) return new Point(x, y);
    this.x = function () {return x;}
    this.y = function () {return y;}
}

// Crockford's prototyping constructor, without first testing if create is defined
// disadvantage: instanceof won't be helpful after
Object.create = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
}
