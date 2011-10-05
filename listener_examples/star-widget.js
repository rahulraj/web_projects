// Javascript star widget
// every element on the page with class "starwidget" has a star widget inserted just before it

// define an array iteration function
// can't use Array's forEach on DOM lists
function iter (a, f) {
	for (var i = 0; i < a.length; i++) f (a[i]);
	}

// invoke f(i) with i ranging over from..to
var fromTo = function (from, to, f) {
	for (var i = from; i <= to; i = i+1) f(i);
	};

// insert star widget just before HTML element sibling
// if initial_value is null, then acts as if no initial value set
// if editable is false, mouse clicks and hovers have no effect
// value is between 1 and 5; 0 means value is not set
// set_value is a function that is called whenever the value is changed
function makeStarWidget (sibling, initial_value, editable, set_value) {
  var star_element = document.createElement("div");
  star_element.className = "stars";
	var stars = [];
	var value = initial_value;
	fromTo(0, 4,
		// create ith star
		(function (i) {
			var star = document.createElement("span");
			star_element.appendChild(star);
			if (i >= initial_value)
        star.className = "star star-basic";
			else
        star.className = "star star-on";
			stars[i] = star;
			var setPrefixClass = function (names) {
				fromTo (0, i,
					function (j) {stars[j].className = names;}
					);
				};
			// if star widget is just for display, don't add listeners
			if (!editable) return;
			star.addEventListener("mouseover", function () {
				// only activate mouseover behavior when value is not set
				if (0 == value)
					setPrefixClass("star star-hover");
				});
			star.addEventListener("mouseout", function () {
				if (0 == value)
					setPrefixClass("star star-basic");
				});
			star.addEventListener("mousedown", function () {
				if (i + 1 == value) {
					value = 0;
					set_value(0);
					setPrefixClass("star star-basic");
				} else if (0 == value) {
					value = i + 1;
					set_value(i + 1);
					setPrefixClass("star star-on");
					};
				});
			}));
	return star_element;
}

window.onload = function () {
  // find all elements with class starwidget
	var elements = document.getElementsByClassName("starwidget");
	iter(elements, function (elt) {
	  // if input element, then make editable and set form value updater
    var editable = (elt.tagName == "INPUT");
    var set_value = function (v) {elt.value = v;};
    // get element value to initialize stars; set to zero if missing
    var initial_value = elt.getAttribute("value");
    if (initial_value == null)
      initial_value = 0;                    
    // create star widget
		var star_element = makeStarWidget(elt, initial_value, editable, set_value);
		// insert just before the element
    elt.parentNode.insertBefore(star_element, elt);
		});
	}