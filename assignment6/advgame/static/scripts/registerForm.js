


/**
 * A register form.
 * @param {jQueryObject} formElement the form element.
 * @param {jQueryObject} usernameField the field for the username.
 * @param {jQueryObject} passwordField the field for the password.
 * @param {jQueryObject} confirmationField the confirmation of the password.
 * @param {jQueryObject} submitButton the button to submit the form.
 * @param {jQueryObject} formFeedback a field in which to display feedback
 *     messages to the user.
 * @constructor
 * @const
 */
game.RegisterForm = function(formElement, usernameField,
    passwordField, confirmationField, submitButton, formFeedback) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.usernameField = usernameField;
  /** @const */ this.passwordField = passwordField;
  /** @const */ this.confirmationField = confirmationField;
  /** @const */ this.submitButton = submitButton;
  /** @const */ this.formFeedback = formFeedback;
};


/**
 * Attach this form to a parentElement
 * @param {jQueryObject} parentElement the parent for this.
 * @const
 */
game.RegisterForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};


/**
 * Add a click even to the submit button.
 * @param {function(string, string, string)} handler a function that takes
 *     the data inputted into the form, presumably to make an AJAX request.
 * @const
 */
game.RegisterForm.prototype.submitClickEvent = function(handler) {
  /** @const */ var self = this;
  this.submitButton.bind('click', function(event) {
    /** @const */ var inputtedUsername = self.usernameField.val();
    /** @const */ var inputtedPassword = self.passwordField.val();
    /** @const */ var confirmedPassword = self.confirmationField.val();
    handler(inputtedUsername, inputtedPassword, confirmedPassword);
  });
};


/**
 * Display a message to the user
 * @param {string} message the message.
 * @const
 */
game.RegisterForm.prototype.displayMessage = function(message) {
  this.formFeedback.html(message);
};


/**
 * Fade out this form
 * @const
 */
game.RegisterForm.prototype.fadeOut = function() {
  this.formElement.fadeOut();
};


/**
 * Factory function for the form.
 * @return {game.RegisterForm} the new form.
 * @const
 */
game.RegisterForm.newForm = function() {
  return new game.RegisterForm.Builder().
      formHeading().
      usernameField().
      passwordField().
      confirmationField().
      submitButton().
      build();
};



/**
 * Builder for RegisterForms
 * @constructor
 * @const
 */
game.RegisterForm.Builder = function() {
  /** @const */ this.formElement = $('<form>');
  /** @const */ this.fieldList = $('<ul>');
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.confirmationFieldElement = null;
  this.submitButtonElement = null;
  this.formFeedback = $('<p>');
};


/**
 * Add a heading to the form.
 * @return {game.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
game.RegisterForm.Builder.prototype.formHeading = function() {
  /** @const */ var heading = $('<p>', {html: 'First time? Register here.'});
  this.formElement.append(heading);
  return this;
};


/**
 * Add a username field.
 * @return {game.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
game.RegisterForm.Builder.prototype.usernameField = function() {
  this.usernameFieldElement =
      game.FormFields.usernameField(this.fieldList);
  return this;
};


/**
 * Add a password field.
 * @return {game.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
game.RegisterForm.Builder.prototype.passwordField = function() {
  this.passwordFieldElement =
      game.FormFields.passwordField(
      this.fieldList, 'password', 'Password');
  return this;
};


/**
 * Add a password confirmation field.
 * @return {game.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
game.RegisterForm.Builder.prototype.confirmationField = function() {
  this.confirmationFieldElement =
      game.FormFields.passwordField(
      this.fieldList, 'confirmPassword', 'Confirm Password');
  return this;
};


/**
 * Add a submit button
 * @return {game.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
game.RegisterForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement =
      game.FormFields.submitButton(this.fieldList, 'Register');
  return this;
};


/**
 * Build the RegisterForm.
 * @return {game.RegisterForm} the new form.
 * @throws {Error} if some fields are not initialized.
 * @const
 */
game.RegisterForm.Builder.prototype.build = function() {
  if (!this.usernameFieldElement || !this.passwordFieldElement ||
      !this.confirmationFieldElement || !this.submitButtonElement) {
    throw new Error('Not fully initialized');
  }
  this.formElement.append(this.fieldList).append(this.formFeedback);
  return new game.RegisterForm(
      this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.confirmationFieldElement,
      this.submitButtonElement, this.formFeedback);
};
