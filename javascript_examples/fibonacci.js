// demonstration of memoization using a functional

// return ith fibonacci number
var fib = function (i) {
    if (i < 2) return 1;
    return fib(i-1) + fib(i-2);
}


// return memoized form of function f
var memoize = function (f) {
    var memo = [];
    var fm = function (i) {
        if (memo[i]) return memo[i];
        result = f(i);
        memo[i] = result;
//        console.log('setting memo[' + i + ']' + ' to ' + result);
        return result;
    }
    return fm;
}

// binds mfib to a memoized version of fib
var mfib = memoize(function (i) {
    if (i < 2) return 1;
    return mfib(i-1) + mfib(i-2);
});

mfib(100);
