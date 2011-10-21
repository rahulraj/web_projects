


/**
 * Class to export a note to the server, so that it can be saved.
 * @param {string} postUrl the URL to send POSTs to.
 * @constructor
 * @implements {networkStickies.Observer}
 */
networkStickies.NoteExporter = function(postUrl) {
  /** @const */ this.postUrl = postUrl;
};


/**
 * When the NoteSet changes, save it.
 * @param {networkStickies.NoteSet} noteSet the notes to save.
 * @const
 */
networkStickies.NoteExporter.prototype.onModelChange = function(noteSet) {
  /** @const */ var setAsJson = noteSet.asJson();
  $.post(this.postUrl, setAsJson, function(data) {
    // currently, this is just the equivalent of a "Save" button,
    // so the callback function is a no-op.
  });
};
