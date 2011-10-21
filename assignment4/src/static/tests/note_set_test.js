NoteSetTest = TestCase('NoteSetTest');

NoteSetTest.prototype.setUp = function() {
  /** @const */ this.coordinates = {left: 50, top: 50};
  /** @const */ this.firstNote = new networkStickies.Note(
      1, 'First note', this.coordinates);
  /** @const */ this.secondNote = new networkStickies.Note(
      2, 'Second note', this.coordinates);
  /** @const */ this.thirdNote = new networkStickies.Note(
      3, 'Third note', this.coordinates);
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

NoteSetTest.prototype.testEditNote = function() {
  /** @const */ var nextSet = this.noteSet.editNoteWithId(
      1, 'Edited first note');

  nextSetFirst = nextSet.findNoteById(1).getOrElse(null);
  assertEquals(nextSetFirst.body(), 'Edited first note');

  oldFirst = this.noteSet.findNoteById(1).getOrElse(null);
  assertEquals('The old note set should be unchanged',
               oldFirst.body(), 'First note');
};

NoteSetTest.prototype.testAddNote = function() {
  /** @const */ var note = new networkStickies.Note(
      4, 'Fourth note', this.coordinates);
  /** @const */ var nextSet = this.noteSet.addNote(note);

  assertNull(this.noteSet.findNoteById(4).getOrElse(null));
  assertEquals('Fourth note', nextSet.findNoteById(4).getOrElse(null).body());
};

NoteSetTest.prototype.testDeleteNote = function() {
  /** @const */ var nextSet = this.noteSet.deleteNoteWithId(1);

  nextSetFirst = nextSet.findNoteById(1).getOrElse(null);
  assertNull(nextSetFirst);

  oldFirst = this.noteSet.findNoteById(1).getOrElse(null);
  assertEquals('The old note set should be unchanged',
               oldFirst.body(), 'First note');
};

NoteSetTest.prototype.testJsonWriteAndRead = function() {
  /** @const */ var jsonSet = this.noteSet.asJson();

  /** @const */ var readSet = networkStickies.NoteSet.readJson(jsonSet);
  assertEquals('First note', readSet.findNoteById(1).getOrElse(null).body());
  assertEquals('Second note', readSet.findNoteById(2).getOrElse(null).body());
  assertEquals('Third note', readSet.findNoteById(3).getOrElse(null).body());
};
