NoteModelTest = TestCase('NoteModelTest');

NoteModelTest.MockObserver = function() {
  this.wasNotified = false;
  this.verifySet = null;
};

NoteModelTest.MockObserver.prototype.setVerifySet = function(verifySet) {
  this.verifySet = verifySet;
};

NoteModelTest.MockObserver.prototype.onModelChange = function(newNoteSet) {
  this.wasNotified = true;
  this.verifySet(newNoteSet);
};

NoteModelTest.prototype.setUp = function() {
  /** @const */ this.firstNote = new networkStickies.Note(1, 'First note');
  /** @const */ this.secondNote = new networkStickies.Note(2, 'Second note');
  /** @const */ this.thirdNote = new networkStickies.Note(3, 'Third note');
  /** @const */ this.notes = [this.firstNote, this.secondNote, this.thirdNote];
  /** @const */ this.noteSet = new networkStickies.NoteSet(this.notes);
  /** @const */ this.observer = new NoteModelTest.MockObserver();

  /** @const */ this.noteModel =
      new networkStickies.NoteModel(this.noteSet, [this.observer]);
};

NoteModelTest.prototype.testEditNote = function() {
  /** @const */ var newMessage = 'Edited first note'

  var verifyWasCalled = false;

  /** @const */ var verify = function(noteSet) {
    verifyWasCalled = true; 
    /** @const */ var note = noteSet.findNoteById(1).getOrElse(null);
    assertEquals(newMessage, note.body());
  };
  this.observer.setVerifySet(verify);
  this.noteModel.editNoteWithId(1, newMessage);

  assertTrue(verifyWasCalled);
  assertTrue(this.observer.wasNotified);
};

NoteModelTest.prototype.testDeleteNote = function() {
  var verifyWasCalled = false;

  /** @const */ var verify = function(noteSet) {
    verifyWasCalled = true;
    /** @const */ var note = noteSet.findNoteById(1).getOrElse(null);
    assertNull(note);
  };
  this.observer.setVerifySet(verify);

  this.noteModel.deleteNoteWithId(1);
  assertTrue(verifyWasCalled);
  assertTrue(this.observer.wasNotified);
};
