/**
 * @constructor
 */
shortener.RegisterForm = function(formElement, usernameField,
    passwordField, confirmationField, submitButton) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.usernameField = usernameField;
  /** @const */ this.passwordField = passwordField;
  /** @const */ this.confirmationField = confirmationField;
  /** @const */ this.submitButton = submitButton;
};

shortener.RegisterForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};

shortener.RegisterForm.newForm = function() {
  return new shortener.RegisterForm.Builder().
      usernameField().
      passwordField().
      confirmationField().
      submitButton().
      build();
};

/**
 * @constructor
 */
shortener.RegisterForm.Builder = function() {
  /** @const */ this.formElement = $('<form>');
  /** @const */ this.fieldList = $('<ul>')
  this.usernameFieldElement = null;
  this.passwordFieldElement = null;
  this.confirmationFieldElement = null;
  this.submitButtonElement = null;
};

shortener.RegisterForm.Builder.prototype.usernameField = function() {
  this.usernameFieldElement =
      shortener.FormFields.usernameField(this.fieldList);
  return this;
};

shortener.RegisterForm.Builder.prototype.passwordField = function() {
  this.passwordFieldElement =
      shortener.FormFields.passwordField(
        this.fieldList, 'password', 'Password');
  return this;
};

shortener.RegisterForm.Builder.prototype.confirmationField = function() {
  this.confirmationFieldElement =
      shortener.FormFields.passwordField(
        this.fieldList, 'confirmPassword', 'Confirm Password');
  return this;
};

shortener.RegisterForm.Builder.prototype.submitButton = function() {
  this.submitButtonElement =
    shortener.FormFields.submitButton(this.fieldList, 'Register');
  return this;
};

shortener.RegisterForm.Builder.prototype.build = function() {
  if (!this.usernameFieldElement || !this.passwordFieldElement ||
      !this.confirmationFieldElement || !this.submitButtonElement) {
    throw new Error('Not fully initialized');
  }
  this.formElement.append(this.fieldList);
  return new shortener.RegisterForm(
      this.formElement, this.usernameFieldElement,
      this.passwordFieldElement, this.confirmationFieldElement, 
      this.submitButtonElement);
};
