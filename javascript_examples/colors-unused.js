// unused bits and pieces for ADT nugget
// in partic hex and lighten functions

// convert integer between 0 and 255 into two-digit hex
function hex(x) {
    // include leading zero in case result would have only one digit
    return ("0" + parseInt(x).toString(16)).slice(-2);
    }

// an immutable ADT for 8 bit colors
var Color = function (r, g, b) {
    var color = {};
    var rgb = [r, g, b];
    color.checkRep = function () {
        // rgb. fold (assert..)
    }
    color.red = function () {return r;}
    color.green = function () {return g;}
    color.blue = function () {return b;}
    // can omit this method; not used
    color.hex = function () {
        return "#" + rgb.map(hex).join('');
    }
    color.toCSS = function () {
        return "rgb(" + rgb.join(",") + ")";        
    }
    return color;
}

// for "this" version
Color.prototype.lighten = function () {
    var hsl = rgbToHsl(this.red, this.green, this.blue);
    hsl[2] = 1-(1-hsl[2])/2;
    var rgb = hslToRgb.apply(null, hsl);
    return new Color(rgb[0], rgb[1], rgb[2]);
}

var Color = function (rgb) {
    var color = {};
    // reduce the distance between the L value and 1.0 by half
    color.lighten = function () {
        var hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);
        hsl[2] = 1-(1-hsl[2])/2;
        var new_rgb = hslToRgb.apply(null, hsl);
        return Color(new_rgb);
    }
    color.hex = function () {
        return "#" + rgb.map(hex).join('');
    }
    color.rgb = function () {
        return "rgb(" + rgb.join(",") + ")";        
    }
    return color;
}

// version with this, called with new
var Color = function (rgb) {
    // reduce the distance between the L value and 1.0 by half
    this.lighten = function () {
        var hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);
        hsl[2] = 1-(1-hsl[2])/2;
        var new_rgb = hslToRgb.apply(null, hsl);
        return Color(new_rgb);
    }
    this.hex = function () {
        return "#" + rgb.map(hex).join('');
    }
    this.rgb = function () {
        return "rgb(" + rgb.join(",") + ")";    
    }
}
Color.prototype.veryLighten = function () {return this.lighten().lighten();}

var mix = function (c1, c2) {
    var avg = function (x, y) {return Math.round ((x+y)/2);}
    return {
        r: avg(c1.r, c2.r),
        g: avg(c1.g, c2.g),
        b: avg(c1.b, c2.b),
        }
    }

var to_css = function (c) {return "rgb(" + c.r + "," + c.g + "," + c.b + ")"}
var show = function (c) {document.body.style.backgroundColor = to_css(c);}

red = {r:255, g:0, b:0};
green = {r:0, g:255, b:0};
blue = {r:0, g:0, b:255};
show(blue);
show(red);
show(mix(red, blue));