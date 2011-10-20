


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
   * Retrieve a note.
   * @param {number} identifier the ID of the note.
   * @return {networkStickies.utils.Option} a Some containing the Note,
   *     or None if no note exists.
   */
  this.findNoteById = function(identifier) {
    /** @const */ var result = _(notesCopy).detect(function(note) {
      return note.identifier() === identifier;
    });
    if (result) {
      return new networkStickies.utils.Some(result);
    } else {
      return networkStickies.utils.None.instance;
    }
  };

  /**
   * Edit a note.
   * @param {number} identifier the ID of the note.
   * @param {string} newBody the new body of the note.
   * @return {networkStickies.NoteSet} the updated model.
   * @const
   */
  this.editNoteWithId = function(identifier, newBody) {
    /** @const */ var newNotes = _(notesCopy).map(function(note) {
      if (note.identifier() !== identifier) {
        return note;
      } else {
        return note.updateBody(newBody);
      }
    });
    return new networkStickies.NoteSet(newNotes);
  };

  this.moveNoteWithId = function(identifier, newCoordinates) {
    /** @const */ var newNotes = _(notesCopy).map(function(note) {
      if (note.identifier() !== identifier) {
        return note; 
      } else {
        return note.updateCoordinates(newCoordinates);
      }
    });
    return new networkStickies.NoteSet(newNotes);
  };

  /**
   * Delete a note.
   * @param {number} identifier the ID of the note.
   * @return {networkStickies.NoteSet} the updated model.
   * @const
   */
  this.deleteNoteWithId = function(identifier) {
    /** @const */ var newNotes = _(notesCopy).reject(function(note) {
      return note.identifier() === identifier;
    });
    return new networkStickies.NoteSet(newNotes);
  };

  this.addNote = function(note) {
    /** @const */ var newNotes = _(notesCopy).map(function(note) {
      return note;
    });
    newNotes.push(note);
    return new networkStickies.NoteSet(newNotes);
  };

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
};

/**
 * Named constructor that reads in a note set from a JSON string.
 * @param {string} jsonString a string representing notes.
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
