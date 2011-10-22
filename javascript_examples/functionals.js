// generator, used in iterative versions of functionals
Array.prototype.each = function (body) {
	for (var i = 0; i < this.length; i++) { body(this[i]); }
	}

// demo of generator, using closure
var sum = function (a) {
    var result = 0;
    a.each(function (e) {
        result += e;
    });
    return result;
	}

// iterative versions
Array.prototype.map = function (f) {
    var result = [];
    this.each (function (e) {
        result.push(f(e));
    });
    return result;
}

Array.prototype.fold = function (f, base) {
    var result = base;
    this.each (function (e) {
        result = f(e, result);
    });
    return result;
}

Array.prototype.filter = function (p) {
    var result = [];
    this.each (function (e) {
        if (p(e)) result.push(e);
    });
    return result;
}

Array.prototype.filter = function (p) {
    var result = [];
    this.each (function (e) {
        if (p(e)) result.push(e);
    });
    return result;
}

// recursive versions
// more like traditional ones, but problematic in JS, since it's not tail recursive
// also a bit ugly since JS doesn't have traditional list operators
var map = function (a, f) {
    map_from = function (i) {
        if (i === a.length) return [];
        var af = map_from(i+1);
        af.unshift(f(a[i]));
        return af;
    }
    return map_from(0);
}

var map = function (a, f) {
    map_from = function (i) {
        if (i === 0) return [];
        return map_from(i-1).concat(f(a[i-1]));
    }
    return map_from(a.length);
}

var reduce  = function (a, f, b) {
    reduce_from = function (i, r) {
        if (i === a.length) return r;
        return reduce_from(i+1, f(a[i], r));
    }
    return reduce_from (0, b);
}

var filter = function (a, f) {
    var filter_add = function (e, af) {
        return f(e) ? af.concat(e) : af;
    };
    return reduce (a, filter_add, []);
}

var filter = function (a, f) {
    filter_from = function (i) {
        if (i === a.length) return [];
        var af = filter_from(i+1);
        return f(a[i]) ? [a[i]].concat(af) : af;
    }
    return filter_from(0);
}

Array.prototype.map = function (f) {
    return map(this, f);
}

var contains = function (a, e) {
    var f = function (x, found) {
        return found || (x === e)
    }
    return reduce(a, f, false);
}

// illustrates a bug
// doesn't work because return only returns from inner function
Array.prototype.contains = function (e) {
    this.each(function (x) {
        if (x === e) return true;
    });
    return false;
}

// version of map illustrating this/that
// but iterative better anyway, and problem doesn't arise there
Array.prototype.map = function (f) {
    // workaround: JS rebinds this on call to map_from
    var that = this;
    var map_from = function (i) {
            if (i === 0) return [];
            return map_from(i-1).concat(f(that[i-1]));
        };
    return map_from(this.length);
}