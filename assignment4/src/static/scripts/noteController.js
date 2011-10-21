


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


/**
 * Action when the Enter button is clicked, signifying that a note
 * body update is complete.
 * @param {number} identifier the ID for the note to update.
 * @const
 */
networkStickies.NoteController.prototype.onEnterButtonClicked =
    function(identifier) {
  /** @const */ var text = this.noteView.editTextAreaText();
  this.noteView.displayMode(text);
  this.noteModel.editNoteWithId(identifier, text);
};


/**
 * Action when a note is deleted.
 * @param {number} identifier the ID for the note to delete.
 * @const
 */
networkStickies.NoteController.prototype.onDeleteButtonClicked =
    function(identifier) {
  this.noteModel.deleteNoteWithId(identifier);
};


/**
 * Action when a note is moved.
 * @param {number} identifier the ID for the note to move.
 * @param {{top: number, left: number}} coordinates the new coordinates.
 * @const
 */
networkStickies.NoteController.prototype.onNoteMoved =
    function(identifier, coordinates) {
  this.noteModel.moveNoteWithId(identifier, coordinates);
};
