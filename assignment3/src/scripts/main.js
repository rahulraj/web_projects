$(function() {
  /** @const */ var form = othello.GameStartForm.createDefaultStartForm();
  /** @const */ var formController = new othello.StartFormController(form);
  form.addPlayButtonClickHandler(function() {
    formController.onPlayButtonClicked();  
  });
  form.attachTo($('section'));
});
