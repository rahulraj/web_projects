/**
 * @constructor
 */
networkStickies.NoteEditor = function(editor) {
  /** @const */ this.editor = editor;
};

networkStickies.NoteEditor.prototype.attachTo = function(parentElement) {
  parentElement.append(this.editor);
};


/**
 * @constructor
 */
networkStickies.NoteEditor.Builder = function() {
  /** @const */ this.editor = $('<div>', {'class': 'noteEditor'});
  this.enterButton = null;
  this.area = null;
};

networkStickies.NoteEditor.Builder.prototype.textArea = function(body) {
  this.area = $('<textarea>', {html: body});
  this.editor.append(this.area);
  return this;
};

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
