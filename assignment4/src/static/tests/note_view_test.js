NoteViewTest = TestCase('NoteViewTest');

NoteViewTest.MockController = function(correctId) {
  /** @const */ this.correctId = correctId;
  this.editClicked = false;
  this.enterClicked = false;
  this.deleteClicked = false;
};

NoteViewTest.MockController.prototype.onEditButtonClicked = function(id) {
  assertEquals(this.correctId, id);
  this.editClicked = true;
};

NoteViewTest.MockController.prototype.onEnterButtonClicked = function(id) {
  assertEquals(this.correctId, id);
  this.enterClicked = true;
};

NoteViewTest.MockController.prototype.onDeleteButtonClicked = function(id) {
  assertEquals(this.correctId, id);
  this.deleteClicked = true;
};

NoteViewTest.prototype.setUp = function() {
  /** @const */ this.noteId = 1;
  /** @const */ this.noteBody = 'First note';
  /** @const */ this.coordinates = {left: 50, top: 50};
  /** @const */ this.note = new networkStickies.Note(
      this.noteId, this.noteBody, this.coordinates);
  /** @const */ this.controller = new NoteViewTest.MockController(this.noteId);

  /** @const */ this.noteViewBuilder = new networkStickies.NoteView.Builder().
    viewing(this.note).
    withEditButton().
    withDeleteButton().
    withEnterButton().
    withTextArea().
    draggable().
    resizable();
  /** @const */ this.noteView = this.noteViewBuilder.build();
};

NoteViewTest.prototype.testBodyContainsNotesBody = function() {
  /** @const */ var body = this.noteView.body();
  assertEquals(this.noteBody, body);
};

NoteViewTest.prototype.disabled_testClicksNotifyController = function() {
  this.noteViewBuilder.editButton.click();
  assertTrue(this.controller.editClicked);

  this.noteViewBuilder.enterButton.click();
  assertTrue(this.controller.enterClicked);

  this.noteViewBuilder.deleteButton.click();
  assertTrue(this.controller.deleteClicked);
};
