// Basic assertion facility
// If pred is false, display alert with msg
var assert = function (msg, pred) {
    if (!pred) alert ("Assertion violation: " + msg);
}

// Included here for convenience so code can be used just by loading this file
Array.prototype.each = function (body) {
	for (var i = 0; i < this.length; i++) { body(this[i]); }
	}

// An ADT for representing a "color chart", being a name space for colors
// that maps color names to colors. 

// Returns an empty color chart.
var ColorChart = function () {
    // Mapping from color names to color objects
    // Rep invariant: values of properties are instances of Color constructor
    var name_to_color = {}; 
    
    // Adds mapping from name to color
    this.add = function (name, color) {
        assert ("add takes Color", color instanceof Color)
        name_to_color[name] = color;
    };
    
    // Returns undefined if no match
    this.lookup = function (name) {
        return name_to_color[name];
    };

    // Returns name of color closest to color given as argument
    this.findBestMatch = function (color) {
        var MAX = 500; // larger than any RGB distance
        var shortest_distance = MAX; var best_match;
        for(var name in name_to_color) {
            if(name_to_color.hasOwnProperty(name)) {
                var c = name_to_color[name];
                distance = c.distance(color);
                if (distance < shortest_distance) {
                    shortest_distance = distance;
                    best_match = name;
                };
            };
        };
        return best_match;
    };
}

// Create a color chart for the colors of lego bricks
// Must load file lego.js first to define the array lego_colors
var lego_color_chart = new ColorChart();
lego_colors.each(function (nc) {
    var name = nc[0]; var color = nc[1];
    console.log("color name: " + name);
    lego_color_chart.add(nc[0], new Color(color[0], color[1], color[2]));
});

var c = new Color(100,50,150);
document.body.style.backgroundColor = c.toCSS();
var n = lego_color_chart.findBestMatch(c); // returns "Bright Violet"
var c2 = lego_color_chart.lookup(n);
document.body.style.backgroundColor = c2.toCSS(); // shows color slightly different from c

// testing rep assertion: fails
legoColorChart.add ("black", [0,0,0]);
