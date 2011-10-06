// return array of length n with all elements initialized to e
// from Crockford, JavaScript: The Good Parts
Array.dim = function (n, e) {
	var a = [], i;
	for (i = 0; i < n; i += 1) {
		a[i] = e;
	}
	return a;
}

Array.prototype.copy = function () {
	return this.slice(0);
}


Array.prototype.isEmpty = function () {
	return (this.length === 0);
}

