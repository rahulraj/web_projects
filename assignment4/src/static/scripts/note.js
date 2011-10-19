


/**
 * Class to represent one sticky note.
 * Representation Invariant - Immutable.
 * @param {number} identifier a numerical identifier for the note.
 *     User-identifier combinations should be unique.
 * @param {string} body the body of the note.
 * @constructor
 * @const
 */
networkStickies.Note = function(identifier, body) {
  /**
   * Getter for the identifier
   * @return {number} identifier.
   * @const
   */
  this.identifier = function() {
    return identifier;
  };

  /**
   * Getter for the body of the note
   * @return {string} body.
   * @const
   */
  this.body = function() {
    return body;
  };
};


/**
 * Return a new Note with the body updated, under the same ID.
 * @param {string} newBody the updated body.
 * @return {networkStickies.Note} the updated Note, leaving this unchanged.
 * @const
 */
networkStickies.Note.prototype.updateBody = function(newBody) {
  return new networkStickies.Note(this.identifier(), newBody);
};


networkStickies.Note.createNoteGenerator = function() {
  var id = 0;
  return function(body) {
    id++;
    return new  networkStickies.Note(id, body);
  };
};


/**
 * Factory function to create a note, generating an identifier for it.
 * @param {string} body the body for the note.
 * @return {networkStickies.Note} the newly created Note.
 * @const
 */
networkStickies.Note.createNote = networkStickies.Note.createNoteGenerator();
