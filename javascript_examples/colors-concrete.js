yellow = {red: 255, green: 255, blue: 0};
toCSS = function (c) {return "rgb(" + c.red + "," + c.green + "," + c.blue + ")"}
document.body.style.backgroundColor = to_css(yellow)

cyan = {};
cyan.red; // undefined
cyan.red = 0; cyan.green = 255; cyan.blue = 255;

cyan[green]
green = "green"
cyan[green]

// next show eval-injection.html

// constructor with literal
var Color = function (r, g, b) {return {red: r, green: g, blue: b};}
yellow = Color(255, 255, 0);
document.body.style.backgroundColor = toCSS(yellow)

// constructor with this and new
var Color = function (r, g, b) {this.red = r; this.green = g; this.blue = b;}
red = new Color(255, 0, 0);
document.body.style.backgroundColor = toCSS(red)

// constructor with literal and method
var Color = function (r, g, b) {return {red: r, green: g, blue: b};}
yellow = Color(255, 255, 0);
document.body.style.backgroundColor = toCSS(yellow)

// constructor with this and new and method
var Color = function (r, g, b) {
    this.red = r; this.green = g; this.blue = b;
    this.toCSS = function () {return "rgb(" + this.red + "," + this.green + "," + this.blue + ")"};
    }
red = new Color(255, 0, 0);
document.body.style.backgroundColor = red.toCSS()

// setting prototype
var Color = function (r, g, b) {this.red = r; this.green = g; this.blue = b; return this;}
Color.prototype = {bits: 24};
green = new Color(0, 255, 0);
green.bits; // 24

// modifying prototype
var Color = function (r, g, b) {this.red = r; this.green = g; this.blue = b; return this;}
Color.prototype.toCSS = function () {
    return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";}
green = new Color(0, 255, 0);
document.body.style.backgroundColor = green.toCSS();

// prototyping patterns nugget
var counter = {val: 0, inc: function() {this.val += 1; return this.val;}}
counter.inc();