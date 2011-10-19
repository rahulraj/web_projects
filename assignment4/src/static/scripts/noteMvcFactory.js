networkStickies.NoteMvcFactory = {};


/**
 * Given a NoteSet, wire up the application to display them.
 * @param {Object.<networkStickies.Note, {top: number, left: number}>} 
 *     jsonNoteSet a JSON object from the server mapping Notes to their 
 *     coordinates.
 * @param {jQueryObject} parentElement the element to attach views to.
 * @const
 */
networkStickies.NoteMvcFactory.createMvc =
    function(jsonNoteSet, parentElement) {
  // TEst data, TODO hook up w/ python
  /** @const */ var first = networkStickies.Note.createNote('This is a first note');
  /** @const */ var second = networkStickies.Note.createNote('This is another note');

  /** @const */ var firstCoordinates = {top: 50, left: 50};
  /** @const */ var secondCoordinates = {top: 170, left: 270};

  ///** @const */ var notes = _.keys(jsonNoteSet);
  /** @const */ var notes = [first, second]
  /** @const */ var coordinates = [firstCoordinates, secondCoordinates];
  /** @const */ var notesAndCoords = _.zip(notes, coordinates);
  /** @const */ var views = _(notesAndCoords).map(function(pair) {
    /** @const */ var note = pair[0];
    /** @const */ var coord = pair[1];
    return networkStickies.NoteView.of(note, coord);
  });
  /** @const */ var noteSet = new networkStickies.NoteSet(notes);
  /** @const */ var model = new networkStickies.NoteModel(noteSet, views);
  /** @const */ var controllers = _(views).map(function(view) {
    /** @const */ var controller = new networkStickies.NoteController(
        model, view);
    view.clicksHandledBy(controller);
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
    /** @const */ var coordinates = {top: 50, left: 50};
    /** @const */ var newView = networkStickies.NoteView.of(
        newNote, coordinates);
    /** @const */ var controller = new networkStickies.NoteController(
        model, newView);
    newView.clicksHandledBy(controller);
    newView.attachTo(parentElement);
    model.addObserver(newView);
    // By updating, the model will notify newView to populate itself.
    model.addNote(newNote);
  });
  parentElement.after(addNoteButton);
};
