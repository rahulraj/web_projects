


/**
 * An user interface to edit a note.
 * @constructor
 * @const
 */
networkStickies.NoteEditor = function(editor) {
  /** @const */ this.editor = editor;
};


/**
 * Attach this editor to a parent.
 * @param {jQueryObject} parentElement the parent for this element.
 * @const
 */
networkStickies.NoteEditor.prototype.attachTo = function(parentElement) {
  parentElement.append(this.editor);
};


/**
 * Named constructor for a NoteEditor
 * @param {string} noteBody the body of the note.
 * @param {{top: number, left: number}} coordinates the coordinates 
 *     of the editor.
 * @param {function(string)} clickHandler a function to handle a click of
 *     the editor button, after being passed the text in the textarea.
 * @const
 */
networkStickies.NoteEditor.of = function(noteBody, coordinates, clickHandler) {
  return new networkStickies.NoteEditor.Builder().
      offsetBy(coordinates).
      textArea(noteBody).
      withEnterButton().
      enterClickHandledBy(clickHandler).
      draggable().
      resizable().
      build();
};


/**
 * Builder for a NoteEditor
 * TODO Factor out some of the duplication between this and NoteView.Builder
 * @constructor
 */
networkStickies.NoteEditor.Builder = function() {
  /** @const */ this.editor = $('<div>', {'class': 'noteEditor'});
  this.enterButton = null;
  this.area = null;
};


/**
 * Set the offset coordinates for the note editor.
 * @param {{top: number, left: number}} coordinates the coordinates to use.
 * @return {networkStickies.NoteEditor.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.offsetBy = function(coordinates) {
  this.editor.offset(coordinates);
  return this;
};


/**
 * Add a text area where the body can be edited.
 * @param {string} body the initial text in the area
 * @return {networkStickies.NoteEditor.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.viewing = function(body) {
  this.area = $('<textarea>', {html: body});
  this.editor.append(this.area);
  return this;
};


/**
 * Add an enter button
 * @return {networkStickies.NoteEditor.Builder} the builder for chaining.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.withEnterButton = function() {
  this.enterButton = $('<input>', {type: 'button', value: 'Enter'});
  this.editor.append(this.enterButton);
  return this;
};


/**
 * Attach a click event handler for this.button.
 * @param {function(string)} handler the handler function, which will be passed
 *     the contents of this editor's text field.
 * @return {networkStickies.NoteEditor.Builder} the Builder for chaining.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.enterClickHandledBy =
    function(handler) {
  this.enterButton.bind('click', function() {
    handler(this.area.val()); 
  });
  return this;
};


/**
 * Make the editor draggable
 * @return {networkStickies.NoteEditor.Builder} the Builder for chaining.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.draggable = function() {
  this.editor.draggable();
};


/**
 * Make the editor resizable
 * @return {networkStickies.NoteEditor.Builder} the Builder for chaining.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.resizable = function() {
  this.editor.resizable();
};


/**
 * Build the editor
 * @return {networkStickies.NoteEditor} the new editor.
 * @const
 */
networkStickies.NoteEditor.Builder.prototype.build = function() {
  return new networkStickies.NoteEditor(this.editor);
};
