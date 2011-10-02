FlatMapTest = TestCase('FlatMapTest')

FlatMapTest.prototype.testFlatMap = function() {
  /** @const */ var first = [1, 2];
  /** @const */ var result = othello.utils.flatMap(first, function(item) {
    if (item === 1) {
      return [3, 4];
    } else {
      return [5, 6];
    }
  });
  /** @const */ var answer = [3, 4, 5, 6];
  _(_.range(1, answer.length)).each(function(i) {
    assertEquals(answer[i], result[i]);
  });
};
