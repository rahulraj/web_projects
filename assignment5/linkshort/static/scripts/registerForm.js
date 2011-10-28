


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
shortener.RegisterForm = function(formElement, usernameField,
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
shortener.RegisterForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};


/**
 * Add a click even to the submit button.
 * @param {function(string, string, string)} handler a function that takes
 *     the data inputted into the form, presumably to make an AJAX request.
 * @const
 */
shortener.RegisterForm.prototype.submitClickEvent = function(handler) {
  /** @const */ var self = this;
  this.submitButton.bind('click', function(event) {
    /** @const */ var inputtedUsername = self.usernameField.val(); 
    /** @const */ var inputtedPassword = self.passwordField.val();
    /** @const */ var confirmedPassword = self.confirmationField.val();
    handler(inputtedUsername, inputtedPassword, confirmedPassword);
  });
};

shortener.RegisterForm.prototype.displayMessage = function(message) {
  this.formFeedback.html(message);
};

shortener.RegisterForm.prototype.fadeOut = function() {
  this.formElement.fadeOut();
};


/**
 * Factory function for the form.
 * @return {shortener.RegisterForm} the new form.
 * @const
 */
shortener.RegisterForm.newForm = function() {
  return new shortener.RegisterForm.Builder().
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
shortener.RegisterForm.Builder = function() {
  /** @const */ this.formElement = $('<form>');
  /** @const */ this.fieldList = $('<ul>');
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.confirmationFieldElement = null;
  this.submitButtonElement = null;
  this.formFeedback = $('<p>');
};


/**
 * Add a username field.
 * @return {shortener.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
shortener.RegisterForm.Builder.prototype.usernameField = function() {
  this.usernameFieldElement =
      shortener.FormFields.usernameField(this.fieldList);
  return this;
};


/**
 * Add a password field.
 * @return {shortener.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
shortener.RegisterForm.Builder.prototype.passwordField = function() {
  this.passwordFieldElement =
      shortener.FormFields.passwordField(
      this.fieldList, 'password', 'Password');
  return this;
};


/**
 * Add a password confirmation field.
 * @return {shortener.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
shortener.RegisterForm.Builder.prototype.confirmationField = function() {
  this.confirmationFieldElement =
      shortener.FormFields.passwordField(
      this.fieldList, 'confirmPassword', 'Confirm Password');
  return this;
};


/**
 * Add a submit button
 * @return {shortener.RegisterForm.Builder} the Builder for chaining.
 * @const
 */
shortener.RegisterForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement =
      shortener.FormFields.submitButton(this.fieldList, 'Register');
  return this;
};


/**
 * Build the RegisterForm.
 * @return {shortener.RegisterForm} the new form.
 * @throws {Error} if some fields are not initialized.
 * @const
 */
shortener.RegisterForm.Builder.prototype.build = function() {
  if (!this.usernameFieldElement || !this.passwordFieldElement ||
      !this.confirmationFieldElement || !this.submitButtonElement) {
    throw new Error('Not fully initialized');
  }
  this.formElement.append(this.fieldList).append(this.formFeedback);
  return new shortener.RegisterForm(
      this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.confirmationFieldElement,
      this.submitButtonElement, this.formFeedback);
};
