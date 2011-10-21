


/**
 * Class to represent one sticky note.
 * Representation Invariant - Immutable.
 * @param {number} identifier a numerical identifier for the note.
 *     User-identifier combinations should be unique.
 * @param {string} body the body of the note.
 * @param {{left: number, top: number}} coordinates the coordinates that this
 *     note appears in. They are stored in this object too, so that they
 *     can be saved when the notes are serialized.
 * @constructor
 * @const
 */
networkStickies.Note = function(identifier, body, coordinates) {
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

  // Defensive copy, or this Note could be mutated by changing
  // coordinates after passing them into this constructor!
  /** @const */ var coordinatesCopy = {left: coordinates.left,
    top: coordinates.top};
  /**
   * Getter for the coordinates of this note. We mus
   * @return {{left: number, top: number}} the coordinates.
   * @const
   */
  this.coordinates = function() {
    // Another copy is needed, otherwise this Note is mutated when
    // the caller changes the output value of this function.
    /** @const */ var coordinatesCopyCopy = {
      left: coordinatesCopy.left,
      top: coordinatesCopy.top
    };
    return coordinatesCopyCopy;
  };
};


/**
 * Return a new Note with the body updated, under the same ID.
 * @param {string} newBody the updated body.
 * @return {networkStickies.Note} the updated Note, leaving this unchanged.
 * @const
 */
networkStickies.Note.prototype.updateBody = function(newBody) {
  return new networkStickies.Note(
      this.identifier(), newBody, this.coordinates());
};


/**
 * Return a new Note with the coordinates updated.
 * @param {{top: number, left: number}} newCoordinates the new coordinates.
 * @return {networkStickies.Note} the updated Note, leaving this unchanged.
 * @const
 */
networkStickies.Note.prototype.updateCoordinates = function(newCoordinates) {
  return new networkStickies.Note(
      this.identifier(), this.body(), newCoordinates);
};


networkStickies.Note.createNoteGenerator = function() {
  // TODO Improve this method. Dates don't work.
  var id = 0;
  return function(body) {
    id++;
    /** @const */ var coordinates = {top: 50, left: 50};
    return new networkStickies.Note(id, body, coordinates);
  };
};


/**
 * Factory function to create a note, generating an identifier for it.
 * @param {string} body the body for the note.
 * @return {networkStickies.Note} the newly created Note.
 * @const
 */
networkStickies.Note.createNote = networkStickies.Note.createNoteGenerator();
