/**
 * Top-level model class for Network Stickies.
 * @param {networkStickies.NoteSet} noteSet the initial note set.
 *     This can change as the user sends input to the application.
 * @param {networkStickies.Observer} observers the observers watching 
 *     this model.
 * @constructor
 * @implements {networkStickies.Observable}
 * @const
 */
networkStickies.NoteModel = function(noteSet, observers) {
  this.noteSet = noteSet;
  /** @const */ this.observers = observers;
};

networkStickies.NoteModel.prototype.notifyObservers = function() {
  /** @const */ var newNoteSet = this.noteSet;
  _(this.observers).each(function(observer) {
    observer.onModelChange(newNoteSet);
  });
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
