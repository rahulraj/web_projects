


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
 * @const
 */
networkStickies.NoteController.prototype.onEditButtonClicked = function() {
  this.noteView.editMode();
};


/**
 * Action when the Enter button is clicked, signifying that a note
 * body update is complete.
 * @param {networkStickies.Note} noteToEdit the note to edit.
 * @const
 */
networkStickies.NoteController.prototype.onEnterButtonClicked =
    function(noteToEdit) {
  /** @const */ var text = this.noteView.editTextAreaText();
  this.noteView.displayMode(text);
  this.noteModel.editNoteWithId(noteToEdit, text);
};


/**
 * Action when a note is deleted.
 * @param {networkStickies.Note} noteToDelete the note to delete.
 * @const
 */
networkStickies.NoteController.prototype.onDeleteButtonClicked =
    function(noteToDelete) {
  this.noteModel.deleteNoteWithId(noteToDelete);
};


/**
 * Action when a note is moved.
 * @param {networkStickies.Note} noteToMove the note to move.
 * @param {{top: number, left: number}} coordinates the new coordinates.
 * @const
 */
networkStickies.NoteController.prototype.onNoteMoved =
    function(noteToMove, coordinates) {
  this.noteModel.moveNoteWithId(noteToMove, coordinates);
};
