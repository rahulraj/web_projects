/**
 * Given a NoteSet, wire up the application to display them.
 * @param {Object.<Note, {top: number, left: number}} jsonNoteSet a JSON object
 *     from the server mapping Notes to their coordinates.
 * @param {jQueryObject} parentElement the element to attach views to.
 */
networkStickies.NoteMvcFactory.createMvc =
    function(jsonNoteSet, parentElement) {
  /** @const */ var notes = _.keys(jsonNoteSet);
  /** @const */ var views = _(notes).map(function(note) {
    return networkStickies.NoteView.of(note, noteSet[note]);
  });
  /** @const */ var noteSet = new networkStickies.NoteSet(notes);
  /** @const */ var model = new networkStickies.NoteModel(NoteSet, views);
  /** @const */ var controllers = _(views).map(function(view) {
    /** @const */ var controller = new networkStickies.Controller(
        noteModel, view);
    view.clicksHandledBy(controller);
    return controller;
  });

  // display the notes
  _(views).each(function(view) {
    view.attachTo(parentElement);
  });
};
