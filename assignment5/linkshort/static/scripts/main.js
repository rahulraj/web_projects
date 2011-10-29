$(function() {
  /** @const */ var parentElement = $('#main');
  shortener.Factory.onStart(shortener.loggedIn, parentElement);
});
