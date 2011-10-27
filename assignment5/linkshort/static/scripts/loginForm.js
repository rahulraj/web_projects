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
  this.fieldList = $('<ul>');
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.submitButtonElement = null;
};

shortener.LoginForm.Builder.prototype.usernameField = function() {
  /** @const */ var usernameLabel = $('<label>', {
    'for': 'username',
    'html': 'Username'
  });
  /** @const */ var labelListItem = $('<li>');
  labelListItem.append(usernameLabel);
  this.usernameFieldElement = $('<input>', {
    type: 'text',
    name: 'username',
    value: ''
  });
  /** @const */ var fieldListItem = $('<li>');
  fieldListItem.append(this.usernameFieldElement);
  this.fieldList.append(labelListItem);
  this.fieldList.append(fieldListItem);
  return this;
};

shortener.LoginForm.Builder.prototype.passwordField = function() {
  /** @const */ var passwordLabel = $('<label>', {
    'for': 'password',
    'html': 'Password'
  });
  /** @const */ var labelListItem = $('<li>');
  labelListItem.append(passwordLabel);
  this.passwordFieldElement = $('<input>', {
    type: 'password',
    name: 'password',
    value: ''
  });
  /** @const */ var fieldListItem = $('<li>');
  fieldListItem.append(this.passwordFieldElement);
  this.fieldList.append(labelListItem);
  this.fieldList.append(fieldListItem);
  return this;
};

shortener.LoginForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement = $('<input>', {
    type: 'button',
    name: 'submit',
    value: 'Log In'
  });
  /** @const */ var buttonListItem = $('<li>');
  buttonListItem.append(this.submitButtonElement);
  this.fieldList.append(buttonListItem);
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
