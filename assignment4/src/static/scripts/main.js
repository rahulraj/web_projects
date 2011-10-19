$(function() {
  /** @const */ var first = networkStickies.Note.createNote('This is a first note');
  /** @const */ var second = networkStickies.Note.createNote('This is another note');

  /** @const */ var set = new networkStickies.NoteSet([first, second]);

  /** @const */ var controller = new networkStickies.NoteController();

  /** @const */ var firstCoordinates = {top: 50, left: 50};
  /** @const */ var secondCoordinates = {top: 170, left: 270};

  /** @const */ var firstView = networkStickies.NoteView.of(
        first, firstCoordinates, controller);

  /** @const */ var secondView = networkStickies.NoteView.of(
        second, secondCoordinates, controller);

  /** @const */ var parent = $('section');
  firstView.attachTo(parent);
  secondView.attachTo(parent);
});
