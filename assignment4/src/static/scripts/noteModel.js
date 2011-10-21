


/**
 * Top-level model class for Network Stickies. Provides the mutability
 * point for the data, and implements an Observable interface.
 * @param {networkStickies.NoteSet} noteSet the initial note set.
 *     This can change as the user sends input to the application.
 * @param {Array.<networkStickies.Observer>} observers the observers watching
 *     this model.
 * @constructor
 * @implements {networkStickies.Observable}
 * @const
 */
networkStickies.NoteModel = function(noteSet, observers) {
  this.noteSet = noteSet;
  // defensive copy
  this.observers = _(observers).map(function(observer) {
    return observer; 
  });
};


/**
 * Notify the observers that this model has changed.
 * @const
 */
networkStickies.NoteModel.prototype.notifyObservers = function() {
  /** @const */ var newNoteSet = this.noteSet;
  _(this.observers).each(function(observer) {
    observer.onModelChange(newNoteSet);
  });
};


/**
 * Edits a note.
 * @param {networkStickies.Note} noteToEdit the note to edit.
 * @param {string} newBody the new body for the note.
 * @const
 */
networkStickies.NoteModel.prototype.editNoteWithId =
    function(noteToEdit, newBody) {
  this.noteSet = this.noteSet.editNoteWithId(noteToEdit, newBody);
  this.notifyObservers();
};


/**
 * Deletes a note.
 * @param {networkStickies.Note} noteToDelete the note to delete.
 * @const
 */
networkStickies.NoteModel.prototype.deleteNoteWithId = function(noteToDelete) {
  this.noteSet = this.noteSet.deleteNoteWithId(noteToDelete);
  this.notifyObservers();
};


/**
 * Moves a note's position.
 * @param {networkStickies.Note} noteToMove the note to move.
 * @param {{top: number, left: number}} newCoordinates the updated coordinates.
 * @const
 */
networkStickies.NoteModel.prototype.moveNoteWithId =
    function(noteToMove, newCoordinates) {
  this.noteSet = this.noteSet.moveNoteWithId(noteToMove, newCoordinates);
  this.notifyObservers();
};


/**
 * Add a note.
 * @param {networkStickies.Note} note the note to add.
 * @const
 */
networkStickies.NoteModel.prototype.addNote = function(note) {
  this.noteSet = this.noteSet.addNote(note);
  this.notifyObservers();
};


/**
 * Add an observer.
 * @param {networkStickies.Observer} observer the observer to add.
 * @const
 */
networkStickies.NoteModel.prototype.addObserver = function(observer) {
  this.observers.push(observer);
};
