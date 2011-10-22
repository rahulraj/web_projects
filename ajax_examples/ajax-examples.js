// examples of use of JQuery AJAX API
var BASE_URL = 'http://127.0.0.1:5000';

var alert_timers = function () {    
// examples of asynchronous events due to timers
    setTimeout(function () {alert("page about to expire!");}, 2000);
    setInterval(function () {alert("take a typing break!");}, 4000);
};

// animated gif from http://www.ajaxload.info/
// note still responsive during animation
// note method chaining
// note that load is overloaded; $(window).load(handler) registers handler as listener for load event!
var loading = function () {
    var url = BASE_URL + '/status';
    $('#status').html('<img src="animated.gif"/>').load(url);
};

// with JQuery selector
var weather = function () {
    var url = "http://www.wunderground.com/US/MA/Newton_Center.html";
    var selector = " #tempActual";
    $('#status').html("Getting current temperature...").load(url + selector);
};

// with continual refresh
var continual = function () {
    var url = BASE_URL + '/status';
    setInterval(
        function () {
            $('#status').html('<img src="animated.gif"/>').load(url);
        }, 10000);
};

// get data and pass to callback
// can't just use alert as callback: JQ bug?
var simple_get = function () {
    var url = BASE_URL + '/debug';
    $.get(url, function (d) {alert("Server says: " + d);});
};

// pass data to server as JS object
// can be used to persist state
// data is passed as key/val pairs in URL with GET
// if method were .post, passed as form data with POST
// examine in Safari network browser eg
var get_with_send = function () {
    var url = BASE_URL + '/welcome';
    var data = {user: "Daniel"};
    $.get(url, data, function (d) {alert(d);});
};

// get JSON object back and parse it
// .getJSON method parses result and passes to callback as object
var get_json_status = function () {
    var url = BASE_URL + '/json_status';
    $.getJSON(url, function (result) {
        $('#status').html('status: ' + result.status + " at: " + result.time);
    });
};

// autocomplete: shows ajax wrapped in JQ plugin
var autocomplete_demo = function () {
    var url = BASE_URL + '/suggestions';
    $("#fruit").autocomplete(
    	{source: function(term, suggest) {
            //pass request to server
            $.getJSON(url, term=term, function(response) {
    	        suggest(response.suggestions);
    			});
    		}
		});
}

// continuation example
// convert dollars to Cuban pesos using 2 services
var conversion = function () {
    $('#dollars').change(
        function () {
            var dollars = $('#dollars').val();
            $.get(BASE_URL + '/dollars2euros', {dollars: dollars}, function (euros) {
                $.get(BASE_URL + '/euros2pesos', {euros: euros}, function (pesos) {
                    var rounded_pesos = parseFloat(pesos).toFixed(2);
                    $('#pesos').val(rounded_pesos);
                });
            });
        });
    }

// again with functions named
var conversion = function () {
    var display_pesos = function (pesos) {
        var rounded_pesos = parseFloat(pesos).toFixed(2);
        $('#pesos').val(rounded_pesos);
    };
    var euros2pesos = function (euros) {
        $.get(BASE_URL + '/euros2pesos', {euros: euros}, display_pesos);
    };
    var convert = function () {
        var dollars = $('#dollars').val();
        $.get(BASE_URL + '/dollars2euros', {dollars: dollars}, euros2pesos);
    };
    $('#dollars').change(convert);
    }

// again, in continuation passing style
var conversion = function () {
    var display_pesos = function (pesos, continuation) {
        var rounded_pesos = parseFloat(pesos).toFixed(2);
        $('#pesos').val(rounded_pesos);
        continuation();
    };
    var euros2pesos = function (euros, continuation) {
        $.get(BASE_URL + '/euros2pesos', {euros: euros}, continuation);
    };
    var dollars2euros = function (continuation) {
        var dollars = $('#dollars').val();
        $.get(BASE_URL + '/dollars2euros', {dollars: dollars}, continuation);
    };        
    $('#dollars').change(
        function () {
            dollars2euros(
                function (e) {euros2pesos(e,
                    function (p) {display_pesos(p,
                        function () {})
                            ;});});});
}