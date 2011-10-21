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
  this.observers = observers;
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
 *
 */
networkStickies.NoteModel.prototype.findNoteById = function(identifier) {
  return this.noteSet.findNoteById(identifier);
};

networkStickies.NoteModel.prototype.editNoteWithId =
    function(identifier, newBody) {
  this.noteSet = this.noteSet.editNoteWithId(identifier, newBody);
  this.notifyObservers();
};


networkStickies.NoteModel.prototype.deleteNoteWithId = function(identifier) {
  this.noteSet = this.noteSet.deleteNoteWithId(identifier);
  this.notifyObservers();
};

networkStickies.NoteModel.prototype.moveNoteWithId =
    function(identifier, newCoordinates) {
  this.noteSet = this.noteSet.moveNoteWithId(identifier, newCoordinates);
  this.notifyObservers();
};

networkStickies.NoteModel.prototype.addObserver = function(observer) {
  this.observers.push(observer);
};

networkStickies.NoteModel.prototype.addNote = function(note) {
  this.noteSet = this.noteSet.addNote(note);
  this.notifyObservers();
};
