/**
 * @param {jQueryObject} formElement the form element.
 * @param {jQueryObject} usernameField the username field.
 * @param {jQueryObject} passwordField the password field.
 * @param {jQueryObject} submitButton the submit button.
 * @constructor
 */
shortener.LoginForm =
    function(formElement, usernameField, passwordField, submitButton) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.usernameField = usernameField;
  /** @const */ this.passwordField = passwordField;
  /** @const */ this.submitButton = submitButton;
};

shortener.LoginForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};

shortener.LoginForm.newForm = function() {
  return new shortener.LoginForm.Builder().
      usernameField().
      passwordField().
      submitButton().
      build();
};

/**
 * @constructor
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

shortener.LoginForm.Builder.prototype.usernameField = function() {
  this.usernameFieldElement =
      shortener.FormFields.usernameField(this.fieldList);
  return this;
};

shortener.LoginForm.Builder.prototype.passwordField = function() {
  this.passwordFieldElement =
      shortener.FormFields.passwordField(
        this.fieldList, 'password', 'Password');
  return this;
};

shortener.LoginForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement =
      shortener.FormFields.submitButton(this.fieldList, 'Log In');
  return this;
};

shortener.LoginForm.Builder.prototype.build = function() {
  if (!this.usernameField || !this.passwordField || !this.submitButton) {
    throw new Error('Not fully initialized') 
  }
  this.formElement.append(this.fieldList);
  return new shortener.LoginForm(this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.submitButtonElement);
};
