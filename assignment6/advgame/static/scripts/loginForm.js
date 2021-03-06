


/**
 * @param {jQueryObject} formElement the form element.
 * @param {jQueryObject} usernameField the username field.
 * @param {jQueryObject} passwordField the password field.
 * @param {jQueryObject} submitButton the submit button.
 * @param {jQueryObject} formFeedback an element in which to leave feedback
 *     messages to the user.
 * @constructor
 * @const
 */
game.LoginForm = function(formElement, usernameField, 
    passwordField, submitButton, formFeedback) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.usernameField = usernameField;
  /** @const */ this.passwordField = passwordField;
  /** @const */ this.submitButton = submitButton;
  /** @const */ this.formFeedback = formFeedback;
};


/**
 * Attach this to a parent.
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
game.LoginForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};


/**
 * Add a click event to the submit button
 * @param {function(string, string)} handler a function that takes an
 *     inputted username and password.
 * @const
 */
game.LoginForm.prototype.submitClickEvent = function(handler) {
  /** @const */ var self = this;
  this.submitButton.bind('click', function(event) {
    /** @const */ var inputtedUsername = self.usernameField.val();
    /** @const */ var inputtedPassword = self.passwordField.val();
    handler(inputtedUsername, inputtedPassword);
  });
};


/**
 * Display a message.
 * @param {string} message the message to display.
 * @const
 */
game.LoginForm.prototype.displayMessage = function(message) {
  this.formFeedback.html(message);
};


/**
 * Fade out this element.
 * @const
 */
game.LoginForm.prototype.fadeOut = function() {
  this.formElement.fadeOut();
};


/**
 * Factory function for a LoginForm
 * @return {game.LoginForm} the form.
 * @const
 */
game.LoginForm.newForm = function() {
  return new game.LoginForm.Builder().
      formHeading().
      usernameField().
      passwordField().
      submitButton().
      build();
};



/**
 * Builder for LoginForms
 * @constructor
 * @const
 */
game.LoginForm.Builder = function() {
  /**
   * @type {jQueryObject}
   * @const
   */
  this.formElement = $('<form>');
  this.fieldList = $('<ul>');
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.submitButtonElement = null;
  this.formFeedback = $('<p>');
};


/**
 * Add a heading for the form
 * @return {game.LoginForm.Builder} the Builder for chaining.
 * @const
 */
game.LoginForm.Builder.prototype.formHeading = function() {
  /** @const */ var heading = $('<p>', {html: 'Have an account? Log in here.'});
  this.formElement.append(heading);
  return this;
};


/**
 * Add a username field.
 * @return {game.LoginForm.Builder} the Builder for chaining.
 * @const
 */
game.LoginForm.Builder.prototype.usernameField = function() {
  this.usernameFieldElement =
      game.FormFields.usernameField(this.fieldList);
  return this;
};


/**
 * Add a password field.
 * @return {game.LoginForm.Builder} the Builder for chaining.
 * @const
 */
game.LoginForm.Builder.prototype.passwordField = function() {
  this.passwordFieldElement =
      game.FormFields.passwordField(
      this.fieldList, 'password', 'Password');
  return this;
};


/**
 * Add a submit button.
 * @return {game.LoginForm.Builder} the Builder for chaining.
 * @const
 */
game.LoginForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement =
      game.FormFields.submitButton(this.fieldList, 'Log In');
  return this;
};


/**
 * Build a LoginForm
 * @return {game.LoginForm} the new form.
 * @throws {Error} if not fully initialized.
 * @const
 */
game.LoginForm.Builder.prototype.build = function() {
  if (!this.usernameField || !this.passwordField || !this.submitButton) {
    throw new Error('Not fully initialized');
  }
  this.formElement.append(this.fieldList).append(this.formFeedback);
  return new game.LoginForm(this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.submitButtonElement, this.formFeedback);
};
