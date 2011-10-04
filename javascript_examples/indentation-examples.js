indent = function (s) {return " " + s;}
indent = function (s) {return indentation + s;}
spaces = function (n) {if (n === 0) return ''; else return ' ' + spaces(n-1);}

// example using functional
indent_by = function (i) {return function (s) {return spaces(i) + s;};}

// unused examples follow
var camel_to_underscore = function (s) {
    var isUpperCase = function (s) {return s.toLowerCase() !== s;};
    var result = '', i = 0;
    while (i < s.length) {
        if (isUpperCase(s[i]))
            result += '_';
        result += s[i].toLowerCase();   
        i += 1;
    }
    return result;
}

// incomplete
// trickier: what if it starts with underscores? ends with them?
// also might want to process JSP style, word by word
var underscore_to_camel = function (s) {
    var result = '', i = 0;
    while (i < s.length) {
        if (s[i] === '_')
            // not correct
            result += s[i].toUpperCase();
        result += s[i];
    }
    return result;
}

