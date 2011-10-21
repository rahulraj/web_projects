

/**
 * A namespace for the MVC factory.
 * @const
 */
networkStickies.NoteMvcFactory = {};


/**
 * Given a NoteSet, wire up the application to display them.
 * @param {string} jsonNoteSet a JSON string from the server
 *     containing Note data for the current user.
 * @param {jQueryObject} parentElement the element to attach views to.
 * @const
 */
networkStickies.NoteMvcFactory.createMvc =
    function(jsonNoteSet, parentElement) {
  /** @const */ var noteSet = networkStickies.NoteSet.readJson(jsonNoteSet);
  /** @const */ var views = noteSet.mapNotes(function(note) {
    return networkStickies.NoteView.of(note);
  });

  /** @const */ var model = new networkStickies.NoteModel(noteSet, views);
  model.addObserver(
      new networkStickies.NoteExporter(networkStickies.storageUrl));
  /** @const */ var controllers = _(views).map(function(view) {
    /** @const */ var controller = new networkStickies.NoteController(
        model, view);
    view.changesHandledBy(controller);
    return controller;
  });

  // display the notes
  _(views).each(function(view) {
    view.attachTo(parentElement);
  });

  // make an add notes button and its click event
  /** @const */ var addNoteButton = $('<input>',
      {type: 'button', value: 'Add a New Note'});
  addNoteButton.bind('click', function(event) {
    /** @const */ var newNote = networkStickies.Note.createNote('New Note');
    // TODO See why the new notes keep moving down
    /** @const */ var coordinates = {top: 50, left: 50};
    /** @const */ var newView = networkStickies.NoteView.of(newNote);
    /** @const */ var controller = new networkStickies.NoteController(
        model, newView);
    newView.changesHandledBy(controller);
    newView.attachTo(parentElement);
    model.addObserver(newView);
    // By updating, the model will notify newView to populate itself.
    model.addNote(newNote);
  });
  parentElement.before(addNoteButton);
};
