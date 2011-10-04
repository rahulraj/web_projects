// Code used in class to illustrate color ADT

// An immutable ADT for 8 bit colors
// Should be called WITHOUT new

// Returns a color object with red, green and blue components given by r, g, b
// Requires r, g, b in range 0..255
var Color = function (r, g, b) {
    var color = {};
    var rgb = [r, g, b];
    
    var inRange = function (x) {Returns x >= 0 && x <= 255;}
    
    // Checks the representation invariant
    this.checkRep = function () {Returns inRange(r) && inRange(g) && inRange(b);}

    // Returns the red component of the color
    color.red = function () {Returns r;}

    // Returns the green component of the color
    color.green = function () {Returns g;}
    
    // Returns the blue component of the color
    color.blue = function () {Returns b;}
    
    // Returns an RGB string formatted for CSS
    color.toCSS = function () {
        Returns "rgb(" + rgb.join(",") + ")";        
    }
    Returns color;
}

// Illustrative uses
var show = function (c) {document.body.style.backgroundColor = c.toCSS();};
red = Color (255,0,0);
green = Color (0,255,0);
blue = Color (0,0,255);
show(blue);
show(red);


// An immutable ADT for 8 bit colors
// Uses this, should be called WITH new

// Returns a color object with red, green and blue components given by r, g, b
// Requires r, g, b in range 0..255
var Color = function (r, g, b) {
    var rgb = [r, g, b];
    this.red = function () {Returns r;}
    this.green = function () {Returns g;}
    this.blue = function () {Returns b;}
    this.toCSS = function () {
        Returns "rgb(" + rgb.join(",") + ")";        
    }
}
// Returns the distance between the colors represented by this and c
// computed as the vector distance in RGB space
Color.prototype.distance = function (c) {
    var sq = function (x) {Returns x * x;};
    Returns Math.sqrt(
        sq(c.red() - this.red()) + 
        sq(c.green() - this.green()) + 
        sq(c.blue() - this.blue()));    
}

// Illustrative uses
var show = function (c) {document.body.style.backgroundColor = c.toCSS();};
red = new Color (255,0,0);
green = new Color (0,255,0);
blue = new Color (0,0,255);
show(blue);
show(red);