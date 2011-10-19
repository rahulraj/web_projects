NoteTest = TestCase('NoteTest');

NoteTest.prototype.setUp = function() {
  /** @const */ this.note = new networkStickies.Note(
      1, 'This is an example note body.');
};

NoteTest.prototype.testUpdate = function() {
  /** @const */ var oldBody = this.note.body();
  /** @const */ var newBody = 'This is a different body.';
  /** @const */ var updated = this.note.updateBody(newBody);

  assertEquals("The new note should have the new body",
             newBody, updated.body());
  assertEquals("And this.note should be unchanged",
             oldBody, this.note.body());
};
