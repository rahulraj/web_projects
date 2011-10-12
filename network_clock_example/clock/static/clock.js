/*
Network Clock
An example to illustrate asynchronous calls to a server
The problem is to maintain a display in the browser of the current time,
assuming that time must be obtained from a server. 
The client is assumed to be able to measure time intervals, but is not assumed
to have its clock set to the correct time.

The protocol is as follows:
-- initially, the display is shown as stale (eg, by being greyed out)
-- the client attempts to obtain the time from the server, repeatedly up to some maximum number of tries
until the measured round trip time for communicating with the server is less than the required tolerance
-- the round trip time is displayed in the browser console
-- if the time is obtained successfully, the display is shown no longer to be stale, and the obtained
time is displayed
-- the time display is then refreshed periodically, not using the server, but by noting the elapsed time at
the client.

The server is implemented as a simple Flask application running locally
-- network delays are simulated by inserting random delays into the response

A complication in the design of this little program is that the attempts to contact the server
should be made sequentially; otherwise, we'd need to include sequence numbers in the requests to match
up responses and calculate round trip times. It's also not clear how we'd determine when to send the next
request/ (Note, by the way, that this code does not handle the case of the server never responding
successfully, which would be important in practice.) Continuation passing style is used to enforce this
sequencing.

The Network Clock is implemented as an abstract data type, with a representation that is hidden inside
a closure.

The server is assumed to provide action at URL /get_time with this spec:
    takes object {request_time: [time in ms]}
    returns object {request_time: [time in ms]; server_time: [time in ms]}
*/

// takes an element representing a clock display with methods
//	    update (hours, mins, seconds)
//	    showCurrent(), showStale(), stopTime() to stop updates

var NetworkClock = function (element, tolerance) {

	// times in ms since Jan 1970
	var measurement = {server_time: 0, client_time: 0, valid: false};

	// get client time in ms
	var getClientTime = function () {
		return new Date().getTime();
	};
	
	// update measurement asynchronously
	var getServerTime = function (continuation) {
		var callback = function (response) {
			var response_received_time = getClientTime();
			var round_trip_time = response_received_time - response.request_time;
			console.log("Round trip time is " + round_trip_time + "ms");
			if (round_trip_time < tolerance) {
				measurement.valid = true;
				measurement.server_time = response.server_time;
				measurement.client_time = getClientTime();
			}
			continuation();
		};
		var params = {request_time: getClientTime()};
		$.getJSON("get_time", params, callback);
	};

	// update display using difference between server and client time
	var update = function () {
		// set display to current time and make current
		var time = measurement.server_time + getClientTime() - measurement.client_time;
		// convert to Javascript time object...
		var date = new Date(time);
		element.update(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		element.showCurrent();
	};

	// attempt to refresh clock display with current time from server and start periodic refreshing
	this.startRefresh = function () {
		// make display stale
		element.showStale();
		// try getting server time until successful
		measurement.valid = false;
		var MAX_TRIES = 10;
		var try_get = function (tries_left) {
			return function () {
				if (tries_left > 0 && !measurement.valid) {
					getServerTime(try_get(tries_left-1));
				} else if (measurement.valid) {
					// update repeatedly until cancelled
					var UPDATE_EVERY = 1000;
					// make display current
					element.showCurrent();
					element.everyTime(UPDATE_EVERY, update);					
				}
			};
		};
		try_get(MAX_TRIES)();
		/* example of what not to do:
		for (var i = 0; i < MAX_TRIES && !measurement.valid; i = i+1) {
			getServerTime();
		}
		*/
	}

    // stop the periodic refreshing of the clock display
	this.stopRefresh = function () {
		// make display stale
		element.showStale();
		element.stopTime();
	}

};
