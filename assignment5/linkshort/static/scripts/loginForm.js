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

shortener.LoginForm.standardForm = function() {
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
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.submitButtonElement = null;
};

shortener.LoginForm.Builder.prototype.usernameField = function() {
  /** @const */ var usernameLabel = $('<label>', {
    'for': 'username',
    'html': 'Username'
  });
  this.usernameFieldElement = $('<input>', {
    type: 'text',
    name: 'username',
    value: ''
  });
  this.formElement.append(usernameLabel);
  this.formElement.append(this.usernameFieldElement);
  return this;
};

shortener.LoginForm.Builder.prototype.passwordField = function() {
  /** @const */ var passwordLabel = $('<label>', {
    'for': 'password',
    'html': 'Password'
  });
  this.passwordFieldElement = $('<input>', {
    type: 'password',
    name: 'password',
    value: ''
  });
  this.formElement.append(passwordLabel);
  this.formElement.append(this.passwordFieldElement);
  return this;
};

shortener.LoginForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement = $('<input>', {
    type: 'button',
    name: 'submit',
    value: 'Log In'
  });
  this.formElement.append(this.submitButtonElement);
  return this;
};

shortener.LoginForm.Builder.prototype.build = function() {
  if (!this.usernameField || !this.passwordField || !this.submitButton) {
    throw new Error('Not fully initialized') 
  }
  return new shortener.LoginForm(this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.submitButtonElement);
};
