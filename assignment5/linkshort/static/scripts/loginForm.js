


/**
 * @param {jQueryObject} formElement the form element.
 * @param {jQueryObject} usernameField the username field.
 * @param {jQueryObject} passwordField the password field.
 * @param {jQueryObject} submitButton the submit button.
 * @constructor
 * @const
 */
shortener.LoginForm =
    function(formElement, usernameField, passwordField, submitButton) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.usernameField = usernameField;
  /** @const */ this.passwordField = passwordField;
  /** @const */ this.submitButton = submitButton;
};


/**
 * Attach this to a parent.
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
shortener.LoginForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};


/**
 * Factory function for a LoginForm
 * @return {shortener.LoginForm} the form.
 * @const
 */
shortener.LoginForm.newForm = function() {
  return new shortener.LoginForm.Builder().
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
shortener.LoginForm.Builder = function() {
  /**
   * @type {jQueryObject}
   * @const
   */
  this.formElement = $('<form>');
  this.fieldList = $('<ul>');
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.submitButtonElement = null;
};


/**
 * Add a username field.
 * @return {shortener.LoginForm.Builder} the Builder for chaining.
 * @const
 */
shortener.LoginForm.Builder.prototype.usernameField = function() {
  this.usernameFieldElement =
      shortener.FormFields.usernameField(this.fieldList);
  return this;
};


/**
 * Add a password field.
 * @return {shortener.LoginForm.Builder} the Builder for chaining.
 * @const
 */
shortener.LoginForm.Builder.prototype.passwordField = function() {
  this.passwordFieldElement =
      shortener.FormFields.passwordField(
      this.fieldList, 'password', 'Password');
  return this;
};


/**
 * Add a submit button.
 * @return {shortener.LoginForm.Builder} the Builder for chaining.
 * @const
 */
shortener.LoginForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement =
      shortener.FormFields.submitButton(this.fieldList, 'Log In');
  return this;
};


/**
 * Build a LoginForm
 * @return {shortener.LoginForm} the new form.
 * @throws {Error} if not fully initialized.
 * @const
 */
shortener.LoginForm.Builder.prototype.build = function() {
  if (!this.usernameField || !this.passwordField || !this.submitButton) {
    throw new Error('Not fully initialized');
  }
  this.formElement.append(this.fieldList);
  return new shortener.LoginForm(this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.submitButtonElement);
};
