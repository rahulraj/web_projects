$(function() {
  /** @const */ var first = networkStickies.Note.createNote('This is a first note');
  /** @const */ var second = networkStickies.Note.createNote('This is another note');

  /** @const */ var firstCoordinates = {top: 50, left: 50};
  /** @const */ var secondCoordinates = {top: 170, left: 270};

  /** @const */ var parent = $('section');


  networkStickies.NoteMvcFactory.createMvc(null, parent);
});
