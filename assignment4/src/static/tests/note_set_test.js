NoteSetTest = TestCase('NoteSetTest');

NoteSetTest.prototype.setUp = function() {
  /** @const */ this.firstNote = new networkStickies.Note(1, 'First note');
  /** @const */ this.secondNote = new networkStickies.Note(2, 'Second note');
  /** @const */ this.thirdNote = new networkStickies.Note(3, 'Third note');
  /** @const */ this.notes = [this.firstNote, this.secondNote, this.thirdNote];
  /** @const */ this.noteSet = new networkStickies.NoteSet(this.notes);
};

NoteSetTest.prototype.testNoteSetBlocksRepresentationExposure = function() {
  /** @const */ var differentNote =
      networkStickies.Note.createNote('A changed note');
  /** @const */ var oldFirstBody = this.firstNote.body();

  this.notes[0] = differentNote;
  /** @const */ var result = this.noteSet.findNoteById(1).getOrElse(null);
  assertEquals('Swapping out the array should not mutate NoteSet',
             result.body(), 'First note');
};

NoteSetTest.prototype.testFindNoteById = function() {
  /** @const */ var first = this.noteSet.findNoteById(1).getOrElse(null);
  assertEquals(first.body(), 'First note');

  /** @const */ var notReal = this.noteSet.findNoteById(324).getOrElse(null);
  assertNull(notReal);
};
