


/**
 * Model class to represent all the notes a user has.
 * Representation Invariants
 *   - Immutable.
 *   - All notes contained in this model should have unique identifiers
 *     with respect to each other.
 * @param {Array.<networkStickies.Note>} notes the notes for the user.
 * @constructor
 * @const
 */
networkStickies.NoteSet = function(notes) {
  // defensive copy
  /** @const */ var notesCopy = _(notes).map(function(note) {
    return note;
  });


  /**
   * Edit a note.
   * @param {networkStickies.Note} noteToEdit a reference to the note to edit.
   * @param {string} newBody the new body of the note.
   * @return {networkStickies.NoteSet} the updated model.
   * @const
   */
  this.editNoteWithId = function(noteToEdit, newBody) {
    /** @const */ var newNotes = _(notesCopy).map(function(note) {
      if (note === noteToEdit) {
        return note;
      } else {
        return note.updateBody(newBody);
      }
    });
    return new networkStickies.NoteSet(newNotes);
  };

  this.moveNoteWithId = function(noteToMove, newCoordinates) {
    /** @const */ var newNotes = _(notesCopy).map(function(note) {
      if (note === noteToMove) {
        return note;
      } else {
        return note.updateCoordinates(newCoordinates);
      }
    });
    return new networkStickies.NoteSet(newNotes);
  };


  /**
   * Delete a note.
   * @param {networkStickies.Note} noteToDelete the note to delete.
   * @return {networkStickies.NoteSet} the updated model.
   * @const
   */
  this.deleteNoteWithId = function(noteToDelete) {
    /** @const */ var newNotes = _(notesCopy).reject(function(note) {
      return note === noteToDelete;
    });
    return new networkStickies.NoteSet(newNotes);
  };


  /**
   * Add a note to the set
   * @param {networkStickies.Note} note the note to add.
   * @return {networkStickies.NoteSet} the updated set.
   * @const
   */
  this.addNote = function(note) {
    /** @const */ var newNotes = _(notesCopy).map(function(note) {
      return note;
    });
    newNotes.push(note);
    return new networkStickies.NoteSet(newNotes);
  };


  /**
   * Represent this set as a JSON string.
   * @return {string} a JSON string containing the data in this set.
   * @const
   */
  this.asJson = function() {
    /** @const */ var noteArray = _(notesCopy).map(function(note) {
      return {
        identifier: note.identifier(),
        body: note.body(),
        coordinates: note.coordinates()
      };
    });
    /** @const */ var jsonSet = {notes: noteArray};
    return JSON.stringify(jsonSet);
  };

  /**
   * Iterate through all the Notes, applying g
   * to each one, and returning an array of the results.
   * @param {function(networkStickies.Note): *} g a function to apply to the
   *     Notes.
   * @return {Array.<*>}  the output of applying that function.
   * @const
   */
  this.mapNotes = function(g) {
    return _(notesCopy).map(g);
  };
};


/**
 * Named constructor that reads in a note set from a JSON string.
 * @param {string} jsonString a string representing notes.
 * @return {networkStickies.NoteSet} the read NoteSet.
 * @const
 */
networkStickies.NoteSet.readJson = function(jsonString) {
  /** @const */ var jsonObject = JSON.parse(jsonString);
  /** @const */ var notesArray = jsonObject.notes;
  /** @const */ var notes = _(notesArray).map(function(noteObjectLiteral) {
    return new networkStickies.Note(noteObjectLiteral.identifier,
        noteObjectLiteral.body, noteObjectLiteral.coordinates);
  });
  return new networkStickies.NoteSet(notes);
};
