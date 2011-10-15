GameStartFormTest = TestCase('GameStartForm');

// Test some basic contents in the HTML, to make sure we're not going
// too far off the mark.
GameStartFormTest.prototype.testPlayerFieldset = function() {
  /** @const */ var whiteFieldset =
      othello.PlayerFieldset.createWhitePlayerFieldset()
  /** @const */ var innerHtml = whiteFieldset.fieldsetElement.html();

  /** @const */ var regexes = [/radio/, /legend/, /White Player/,
          /whiteHuman/, /whiteEasyAi/, /whiteMediumAi/,
          /Human/, /Easy AI/, /Medium AI/];
          
  othello.utils.each(regexes, function(regex) {
    assertTrue(regex.test(innerHtml));
  });
};

GameStartFormTest.prototype.testGameStartForm = function() {
  /** @const */ var startForm = othello.GameStartForm.createDefaultStartForm();
  /** @const */ var innerHtml = startForm.formElement.html();

  othello.utils.each([/Play/], function(regex) {
    assertTrue(regex.test(innerHtml));
  });
};
