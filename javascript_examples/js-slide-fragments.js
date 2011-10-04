/*
JS overview
*/
    
// language basics
var MAX = 10;
var line = function (i, x) {
    var l = i + " times " + x
         + " is " + (i * x);
    return l;
}
var table = function (x) {
    for (var i = 1; i <= MAX; i += 1) {
        console.log(line(i, x));
    }
}
// display times table for 3
table(3);    

// objects
var Point = function (x, y) {this.x = x; this.y = y;}
Point.prototype.magnitude = function () {return Math.sqrt(this.x * this.x + this.y * this.y);}
p = new Point(1,2)
p.magnitude
p.magnitude()

/*
JS values
*/
keys([])
keys("hello")
keys(123)
keys(true)

x = ['h', 'i']
y = x
y[1] = 'o'
x
x = 'hi'
...

/*
JS closures
*/

three = function () {return 3;}
id = function (x) {return x;}

seq = function () {seq.c += 1; return seq.c;}
seq = function () {return (seq.c = seq.next(seq.c));}
seq.next = function (i) {return i + 2;}

(function (x) {return x + 1;}) (3)
log = function (s) {console.log(s + seq());}
(function () {log('c')}) (log('a'),log('b'))

f = (function (x) {return function () {return x;};}) (x)
f = function () {return x;}

f = function (x) {return x;}

f = (function (x) {return function () {return x;};}) (x)

f = (function (x) {return function () {x += 1; return x;};}) (0)

// lexical scope
x = 1;
f = (function (x) {
        return function () {return x;};
        })
    (x)
x = 2;
f();

// hiding local vars
sum = function (a, s, i) {
       s = 0;
       for (i = 0; i < a.length; i += 1) s += a[i];
       return s;}

inc = function (x, y) {return y ? x+y : x+1;}

// using var decls
sum = function (a) {
       var s = 0;
       for (var i = 0; i < a.length; i += 1) s += a[i];
       return s;}
       
// not in slides; effect of unreachable var
var f = function () {
    x = 12;
    if (false) var x = 13;
}

// example from http://www-cs-students.stanford.edu/~ataly/Talks/aplas08.pdf
var f = function(){
   if (true) {
       function g() { return 1;}; 
   } else {
       function g() { return 2;};
   }
   var g = function() { return 3;}
   return g();
   function g(){ return 4;}
   }
var result = f();

// with vars instead. behaves sensibly everywhere?
var f = function(){
    if (true) {
        var g = function () { return 1;}; 
    } else {
        var g = function () { return 2;};
    }
    var g = function() { return 3;}
    return g();
    var g = function (){ return 4;}
    }
var result = f();

f = function () {f = function () {return 1;}; return 2;}

