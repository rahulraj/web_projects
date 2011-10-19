


/**
 * Constructor for a view of a single note.
 * @param {jQueryObject} noteElement the element holding the note.
 * @constructor
 * @const
 */
networkStickies.NoteView = function(noteElement) {
  /** @const */ this.noteElement = noteElement;
};


/**
 * Attach this view to a parent element.
 * @param {jQueryObject} parentElement this element's future parent.
 * @const
 */
networkStickies.NoteView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.noteElement);
};


/**
 * Get the text contained within this.noteElement representing the
 * note that the user made.
 * @return {string} the text in the note.
 * @const
 */
networkStickies.NoteView.prototype.body = function() {
  return this.noteElement.children('p').html();
};


/**
 * Factory function to create a view given a note.
 * @param {networkStickies.Note} note the note being viewed.
 * @param {{top: number, left: number}} coordinates an object containing
 *     coordinates for the Note. This format is the same one jQuery's
 *     offset function uses.
 * @param {networkStickies.NoteController} controller the controller handling
 *     on click events.
 * @return {networkStickies.NoteView} the newly created view.
 * @const
 */
networkStickies.NoteView.of = function(note, coordinates, controller) {
  return new networkStickies.NoteView.Builder().
      viewing(note).
      offsetBy(coordinates).
      withEditButton().
      withDeleteButton().
      clicksHandledBy(controller).
      draggable().
      resizable().
      build();
};



/**
 * A Builder to construct NoteViews in multiple steps.
 * @constructor
 * @const
 */
networkStickies.NoteView.Builder = function() {
  /** 
   * @type {jQueryObject}
   * @const 
   */ 
  this.noteElement = $('<div>', {'class': 'note'});
  this.editButton = null;
  this.deleteButton = null;
  this.identifier = null;
};


/**
 * Set the offset coordinates for the note.
 * @param {{top: number, left: number}} coordinates the coordinates to use.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.offsetBy = function(coordinates) {
  this.noteElement.offset(coordinates);
  return this;
};


/**
 * Set the Note that this View is displaying. Creates the body element
 * and keeps track of the ID for configuration with the controller.
 * @param {networkStickies.Note} note the note.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.viewing = function(note) {
  /** @const */ var bodyElement = $('<p>');
  bodyElement.html(note.body());
  this.noteElement.append(bodyElement);
  this.identifier = note.identifier();
  return this;
};


/**
 * Add an Edit button.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.withEditButton = function() {
  this.editButton = $('<input>', {type: 'button', value: 'Edit'});
  this.noteElement.append(this.editButton);
  return this;
};


/**
 * Add a Delete button.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.withDeleteButton = function() {
  this.deleteButton = $('<input>', {type: 'button', value: 'Delete'});
  this.noteElement.append(this.deleteButton);
  return this;
};


/**
 * Specify the controller object to handle click events.
 * @param {networkStickies.NoteController} controller the object with methods to
 *     handle click events. It needs to be passed the ID of the note.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.clicksHandledBy =
    function(controller) {
  /** @const */ var identifier = this.identifier;
  this.editButton.bind('click', function(event) {
    controller.onEditButtonClicked(identifier);
  });
  this.deleteButton.bind('click', function(event) {
    controller.onDeleteButtonClicked(identifier);
  });
  return this;
};


networkStickies.NoteView.Builder.prototype.draggable = function() {
  this.noteElement.draggable();
  return this;
};

networkStickies.NoteView.Builder.prototype.resizable = function() {
  this.noteElement.resizable();
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
