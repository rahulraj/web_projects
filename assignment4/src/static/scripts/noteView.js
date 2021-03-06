


/**
 * Constructor for a view of a single note. Starts in display mode.
 * When in edit mode, displays a text area to allow the user to edit the note.
 * @param {jQueryObject} noteElement the element holding the note.
 * @param {jQueryObject} bodyElement the element displaying the note's text
 *     in a read-only format.
 * @param {jQueryObject} editButton the edit button.
 * @param {jQueryObject} deleteButton the delete button.
 * @param {jQueryObject} enterButton the enter button for editing
 *     (hidden when not in edit mode).
 * @param {jQueryObject} editTextArea the area to edit the note.
 * @param {string} identifier the ID for the note this is viewing.
 * @constructor
 * @implements {networkStickies.Observer}
 * @const
 */
networkStickies.NoteView = function(noteElement, bodyElement,
    editButton, deleteButton, enterButton, editTextArea, identifier) {
  /** @const */ this.noteElement = noteElement;
  /** @const */ this.bodyElement = bodyElement;
  /** @const */ this.editButton = editButton;
  /** @const */ this.deleteButton = deleteButton;
  /** @const */ this.enterButton = enterButton;
  /** @const */ this.editTextArea = editTextArea;
  /** @const */ this.identifier = identifier;
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
 * Specify the controller object to handle click events.
 * @param {networkStickies.NoteController} controller the object with methods to
 *     handle click events. It needs to be passed the ID of the note.
 * @const
 */
networkStickies.NoteView.prototype.changesHandledBy = function(controller) {
  /** @const */ var identifier = this.identifier;
  this.editButton.bind('click', function(event) {
    controller.onEditButtonClicked(identifier);
  });
  this.enterButton.bind('click', function(event) {
    controller.onEnterButtonClicked(identifier);
  });
  this.deleteButton.bind('click', function(event) {
    controller.onDeleteButtonClicked(identifier);
  });
  /** @const */ var self = this;
  this.noteElement.bind('dragstop', function(event, ui) {
    controller.onNoteMoved(identifier, self.coordinates());
  });
};


/**
 * Switch to edit mode.
 * @const
 */
networkStickies.NoteView.prototype.editMode = function() {
  this.bodyElement.hide();
  this.editButton.hide();
  this.deleteButton.hide();
  this.enterButton.show();
  this.editTextArea.val(this.body());
  this.editTextArea.show();
};


/**
 * Switch to display mode.
 * @param {string} bodyText the text to display in the body.
 * @const
 */
networkStickies.NoteView.prototype.displayMode = function(bodyText) {
  this.bodyElement.show();
  this.editButton.show();
  this.deleteButton.show();
  this.enterButton.hide();
  this.editTextArea.hide();
  this.updateBody(bodyText);
};


/**
 * Get the text in the edit textarea.
 * @return {string} the text.
 * @const
 */
networkStickies.NoteView.prototype.editTextAreaText = function() {
  return this.editTextArea.val();
};


/**
 * Update the text in the body.
 * @param {string} newBody the new text.
 * @const
 */
networkStickies.NoteView.prototype.updateBody = function(newBody) {
  this.bodyElement.html(newBody);
};


/**
 * Get the text contained within this.noteElement representing the
 * note that the user made.
 * @return {string} the text in the note.
 * @const
 */
networkStickies.NoteView.prototype.body = function() {
  return this.bodyElement.html();
};


/**
 * Update the view when the model changes.
 * @param {networkStickies.NoteSet} newNoteSet the updated notes.
 * @const
 */
networkStickies.NoteView.prototype.onModelChange = function(newNoteSet) {
  /** @const */ var note = newNoteSet.findNoteById(this.identifier);
  if (note === networkStickies.utils.None.instance) {
    // this note was removed, remove the view too.
    this.noteElement.remove();
  } else {
    /** @const */ var noteElement = note.getOrElse(null);
    /** @const */ var body = noteElement.body();
    this.updateBody(body);
  }
};


/**
 * Get the current coordinates of this element.
 * @return {{top: number, left: number}} an object containing coordinates.
 * @const
 */
networkStickies.NoteView.prototype.coordinates = function() {
  return this.noteElement.offset();
};


/**
 * Factory function to create a view given a note.
 * @param {networkStickies.Note} note the note being viewed.
 * @return {networkStickies.NoteView} the newly created view.
 * @const
 */
networkStickies.NoteView.of = function(note) {
  return new networkStickies.NoteView.Builder().
      viewing(note).
      offsetBy(note.coordinates()).
      withEditButton().
      withDeleteButton().
      withEnterButton().
      withTextArea().
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
  this.bodyElement = null;
  this.editButton = null;
  this.deleteButton = null;
  this.enterButton = null;
  this.editTextArea = null;
  this.identifier = null;
};


/**
 * Set the offset coordinates for the note.
 * @param {{top: number, left: number}} coordinates the coordinates to use.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.offsetBy = function(coordinates) {
  this.noteElement.css('position', 'absolute');
  this.noteElement.css('top', coordinates.top + 'px');
  this.noteElement.css('left', coordinates.left + 'px');
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
  this.bodyElement = $('<p>');
  this.bodyElement.html(note.body());
  this.noteElement.append(this.bodyElement);
  this.identifier = note.identifier();
  return this;
};

networkStickies.NoteView.Builder.createButton = function(value) {
  return $('<input>', {type: 'button', 'class': 'button', value: value});
};


/**
 * Add an Edit button.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.withEditButton = function() {
  this.editButton = networkStickies.NoteView.Builder.createButton('Edit');
  this.noteElement.append(this.editButton);
  return this;
};


/**
 * Add a Delete button.
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.withDeleteButton = function() {
  this.deleteButton = networkStickies.NoteView.Builder.createButton('Delete');
  this.noteElement.append(this.deleteButton);
  return this;
};


/**
 * Add an enter button
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.withEnterButton = function() {
  this.enterButton = networkStickies.NoteView.Builder.createButton('Enter');
  this.enterButton.hide();
  this.noteElement.append(this.enterButton);
  return this;
};


/**
 * Add a textarea
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.withTextArea = function() {
  this.editTextArea = $('<textarea>');
  this.editTextArea.hide();
  this.noteElement.append(this.editTextArea);
  return this;
};


/**
 * Make the sticky draggable
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteView.Builder.prototype.draggable = function() {
  this.noteElement.draggable();
  return this;
};


/**
 * Make the sticky resizable
 * @return {networkStickies.NoteView.Builder} the builder for chaining.
 * @const
 */
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
  if (!this.bodyElement || !this.editButton || !this.deleteButton ||
      !this.enterButton || !this.editTextArea || !this.identifier) {
    throw new Error('Uninitialized parts of the view');
  }
  return new networkStickies.NoteView(this.noteElement, this.bodyElement,
      this.editButton, this.deleteButton, this.enterButton, this.editTextArea,
      this.identifier);
};
