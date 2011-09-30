OptionTest = TestCase('OptionTest');

OptionTest.prototype.setUp = function() {
  /** @const */ this.addFour = function(num) { return num + 4};
  /** @const */ this.firstSome = new othello.utils.Some(4);
  /** @const */ this.firstNone = othello.utils.None.instance;

  /** @const */ this.secondSome = new othello.utils.Some(10);
  /** @const */ this.maybeAddTen = function(num) {
    if (num === 4) {
      return new othello.utils.Some(num + 10); 
    } else {
      return othello.utils.None.instance;
    }
  };
};

OptionTest.prototype.testSomeMap = function() {
  /** @const */ var result = this.firstSome.map(this.addFour);
  assertEquals(8, result.getOrElse(1000));
};

OptionTest.prototype.testNoneMap = function() {
  /** @const */ var result = this.firstNone.map(this.addFour);
  assertEquals(1000, result.getOrElse(1000));
};

OptionTest.prototype.testSomeFlatMap = function() {
  /** @const */ var result = this.firstSome.flatMap(this.maybeAddTen);
  assertEquals(14, result.getOrElse(1000));

  /** @const */ var anotherResult =
      this.secondSome.flatMap(this.maybeAddTen);
  assertEquals(1000, anotherResult.getOrElse(1000));
};

OptionTest.prototype.testNoneFlatMap = function() {
  /** @const */ var result = this.firstNone.flatMap(this.maybeAddTen);
  assertEquals(1000, result.getOrElse(1000));
};
