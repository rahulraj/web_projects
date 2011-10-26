/* JSLint directives: */
/*jslint devel: true, browser: true, indent: 2 */
/*global jQuery, $, test, ok, equal, module, expect, asyncTest, start */

$(document).ready(function () {
  "use strict";

  test("a basic test example", function () {
    ok(true, "this test is fine");
    var value = "hello";
    equal(value, "hello", "We expect value to be hello");
  });

  module("Module A");

  test("first test within module", function () {
    ok(true, "all pass");
  });

  test("second test within module", function () {
    ok(true, "all pass");
  });

  module("Module B");

  test("some other test", function () {
    expect(2);
    equal(true, false, "this is a demonstration of a failing test");
    equal(true, true, "this test will pass");
  });

  module("6.170 Example Tests");

  asyncTest("This test takes one second to run", function () {
    setTimeout(function () {
      ok(true, "always fine");
      start();
    }, 1000);
  });

  // See http://stackoverflow.com/questions/2505063/how-to-assert-unit-test-servers-json-response
  asyncTest("Example test of the bit.ly API", 1, function () {
    // See http://jquery-howto.blogspot.com/2009/04/shorten-long-urls-with-jquery-bitly.html

    // Set up default options
    var defaults = {
      version:    '2.0.1',
      login:      'ebakke',
      apiKey:     'R_6e2c7b4aeac6514fffbf397956b947e3',
      history:    '0',
      longUrl:    'https://stellar.mit.edu/S/course/6/fa11/6.S183/'
    },

    // Build the URL to query
      daurl = "http://api.bit.ly/shorten?" +
      "version=" + defaults.version +
      "&longUrl=" + defaults.longUrl +
      "&login=" + defaults.login +
      "&apiKey=" + defaults.apiKey +
      "&history=" + defaults.history +
      "&format=json&callback=?";

    // Utilize the bit.ly API
    $.getJSON(daurl, function (data) {
      expect(2);
      // console.log(data.results);
      equal(data.statusCode, "OK", "Status code OK");
      equal(data.results[defaults.longUrl].shortUrl, "http://bit.ly/ukiJBz", "Shortened URL OK");
      start();
    });
  });

});

