BoardHistoryTest = TestCase('BoardHistoryTest');

BoardHistoryTest.prototype.setUp = function() {
  /** @const */ this.history = new othello.BoardHistory(1);
  this.history.push(2);
  this.history.push(3);
};

BoardHistoryTest.prototype.testBasicUndo = function() {
  assertEquals(2, this.history.undo());
  assertEquals(1, this.history.undo());
};

BoardHistoryTest.prototype.testModifiedUndo = function() {
  assertEquals(2, this.history.undo());

  this.history.push(4);
  this.history.push(5);

  assertEquals(4, this.history.undo());
  assertEquals(2, this.history.undo());
};

BoardHistoryTest.prototype.testRedosNotAllowedBeforeUndos = function() {
  assertFalse(this.history.canRedo());

  this.history.undo();

  assertTrue(this.history.canRedo());
};

BoardHistoryTest.prototype.testRedosAfterUndos = function() {
  assertFalse(this.history.canRedo());

  this.history.undo();

  assertTrue(this.history.canRedo());
  assertEquals(3, this.history.redo());
};

BoardHistoryTest.prototype.testNewPushesDeleteRedos = function() {
  this.history.undo();

  this.history.push(5);
  assertFalse(this.history.canRedo());

  assertEquals(2, this.history.undo());
}

BoardHistoryTest.prototype.testBeginningUndo = function() {
  /** @const */ history = new othello.BoardHistory(1);
  assertFalse(history.canUndo());
  history.push(2);
  assertTrue(history.canUndo());
  assertEquals(1, history.undo());
  assertFalse(history.canUndo());
};
