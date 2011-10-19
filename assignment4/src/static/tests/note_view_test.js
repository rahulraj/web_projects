NoteViewTest = TestCase('NoteViewTest');

NoteViewTest.prototype.setUp = function() {
  /** @const */ this.note = new networkStickies.Note(1, 'First note');
  /** @const */ this.noteView = new networkStickies.NoteView.Builder().
    viewing(this.note).
    withEditButton().
    withDeleteButton().
    draggable().
    resizable().build();
};

NoteViewTest.prototype.testBodyContainsNotesBody = function() {
  /** @const */ var body = this.noteView.body();
  assertEquals(body, 'First note');
};
