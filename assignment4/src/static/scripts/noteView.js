/**
 * Constructor for a view of a single note.
 * @param {jQueryObject} noteElement the element holding the note.
 * @constructor
 * @const
 */
networkStickies.NoteView = function(noteElement) {
  /** @const */ this.noteElement = noteElement;
};

networkStickies.NoteView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.noteElement);
};


/**
 * Factory function to create a view given a note.
 * @param {networkStickies.Note} note the note being viewed.
 * @param {{top: number, left: number}} coordinates an object containing
 *     coordinates for the Note. This format is the same one jQuery's
 *     offset function uses.
 * @param {networkStickies.NoteController} controller the controller handling
 *     on click events.
 * @const
 */
networkStickies.NoteView.of = function(note, coordinates, controller) {
  return new networkStickies.NoteView.Builder().
      offsetBy(coordinates).
      body(note.body()).
      editButton().
      deleteButton().
      clicksHandledBy(controller).
      build();
};


/**
 * A Builder to construct NoteViews in multiple steps.
 * @constructor
 * @const
 */
networkStickies.NoteView.Builder = function() {
  /** @const */ this.noteElement = $('<div>' {'class': 'note'});
  this.editButton = null;
  this.deleteButton = null;
};


/**
 * Set the offset coordinates for the note.
 * @param {{top: number, left: number}} the coordinates to use.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.offsetBy = function(coordinates) {
  this.noteElement.offset(coordinates);
  return this;
};


/**
 * Set the contents of the NoteView's body.
 * @param {string} body the body of the note.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.body = function(body) {
  /** @const */ var bodyElement = $('<p>');
  bodyElement.html(body);
  this.noteElement.append(bodyElement);
  return this;
};


/**
 * Add an Edit button.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.editButton = function() {
  this.editButton = $('<input>', {type: 'button', value: 'Edit'});
  this.noteElement.append(this.editButton);
  return this;
};


/**
 * Add a Delete button.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.deleteButton = function() {
  this.deleteButton = $('<input>', {type: 'button', value: 'Delete'});
  this.noteElement.append(this.deleteButton);
  return this;
};


/**
 * Specify the controller object to handle click events.
 * @param {networkStickies.NoteController} controller the object with methods to
 *     handle click events.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.clicksHandledBy =
    function(controller) {
  this.editButton.bind('click', function(event) {
    controller.onEditButtonClicked(); 
  });
  this.deleteButton.bind('click', function(event) {
    controller.onDeleteButtonClicked(); 
  });
  return this;
};


/**
 * Build the NoteView.
 * @return {networkStickies.NoteView} the newly created view.
 * @const
 */
networkStickies.NoteView.Builder.prototype.build = function() {
  return new networkStickies.NoteView(this.noteElement);
};
