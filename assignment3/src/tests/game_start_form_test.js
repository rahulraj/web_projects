GameStartFormTest = TestCase('GameStartForm');

// Test some basic contents in the HTML, to make sure we're not going
// too far off the mark.
GameStartFormTest.prototype.testPlayerFieldset = function() {
  /** @const */ var whiteFieldset =
      othello.PlayerFieldset.createWhitePlayerFieldset()
  /** @const */ var innerHtml = whiteFieldset.fieldsetElement.html();

  _.each([/radio/, /legend/, /White Player/,
          /whiteHuman/, ,/whiteEasyAi/, /whiteMediumAi/,
          /Human/, /Easy AI/, /Medium AI/], function(regex) {
    assertTrue(regex.test(innerHtml));
  });
};

GameStartFormTest.prototype.testGameStartForm = function() {
  /** @const */ var startForm = othello.GameStartForm.createDefaultStartForm();
  /** @const */ var innerHtml = startForm.formElement.html();

  _.each([/Play/], function(regex) {
    assertTrue(regex.test(innerHtml));
  });
};
