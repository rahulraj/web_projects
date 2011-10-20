


/**
 * Controller to handle click events on NoteViews.
 * @param {networkStickies.NoteModel} noteModel the model to forward calls to.
 * @param {networkStickies.NoteView} noteView the view this is controlling.
 *     Currently, there is one controller for every NoteView.
 * @constructor
 * @const
 */
networkStickies.NoteController = function(noteModel, noteView) {
  /** @const */ this.noteModel = noteModel;
  /** @const */ this.noteView = noteView;
};


/**
 * Swap out the NoteView with a NoteEditor that allows users to edit
 * that note, then click Confirm to switch back to a NoteView.
 * @param {number} identifier the ID for the note being edited.
 * @const
 */
networkStickies.NoteController.prototype.onEditButtonClicked =
    function(identifier) {
  this.noteView.editMode();
};

networkStickies.NoteController.prototype.onEnterButtonClicked =
    function(identifier) {
  /** @const */ var text = this.noteView.editTextAreaText();
  this.noteView.displayMode(text);
  this.noteModel.editNoteWithId(identifier, text);
};

networkStickies.NoteController.prototype.onDeleteButtonClicked =
    function(identifier) {
  this.noteModel.deleteNoteWithId(identifier);
};

networkStickies.NoteController.prototype.onNoteMoved =
    function(identifier, coordinates) {
  this.noteModel.moveNoteWithId(identifier, coordinates);
};
