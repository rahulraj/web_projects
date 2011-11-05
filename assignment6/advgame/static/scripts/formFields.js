

/**
 * Namespace for utility functions to create form fields.
 * @const
 */
game.FormFields = {};


/**
 * Create a username field, and appends to the parent element.
 * @param {jQueryObject} parentElement the parent element.
 * @return {jQueryObject} the created username field.
 * @const
 */
game.FormFields.usernameField = function(parentElement) {
  /** @const */ var usernameLabel = $('<label>', {
    'for': 'username',
    'html': 'Username'
  });
  /** @const */ var labelListItem = $('<li>');
  labelListItem.append(usernameLabel);
  /** @const */ var usernameFieldElement = $('<input>', {
    type: 'text',
    name: 'username',
    value: ''
  });
  /** @const */ var fieldListItem = $('<li>');
  fieldListItem.append(usernameFieldElement);
  parentElement.append(labelListItem);
  parentElement.append(fieldListItem);
  return usernameFieldElement;
};


/**
 * Create a passwordField and add it to the given parentElement.
 * @param {jQueryObject} parentElement the parent for the field.
 * @param {string} fieldName the name for the field.
 * @param {string} label the label to display.
 * @return {jQueryObject} the created field.
 * @const
 */
game.FormFields.passwordField = function(parentElement, fieldName, label) {
  /** @const */ var passwordLabel = $('<label>', {
    'for': fieldName,
    'html': label
  });
  /** @const */ var labelListItem = $('<li>');
  labelListItem.append(passwordLabel);
  /** @const */ var passwordFieldElement = $('<input>', {
    type: 'password',
    name: fieldName,
    value: ''
  });
  /** @const */ var fieldListItem = $('<li>');
  fieldListItem.append(passwordFieldElement);
  parentElement.append(labelListItem);
  parentElement.append(fieldListItem);
  return passwordFieldElement;
};


/**
 * Create a submit button and add it to the given parent.
 * @param {jQueryObject} parentElement the parent.
 * @param {string} value the value to display in the button.
 * @return {jQueryObject} the created button.
 * @const
 :w*/
game.FormFields.submitButton = function(parentElement, value) {
  /** @const */ var submitButtonElement = $('<input>', {
    type: 'button',
    name: 'submit',
    value: value
  });
  /** @const */ var buttonListItem = $('<li>');
  buttonListItem.append(submitButtonElement);
  parentElement.append(buttonListItem);
  return submitButtonElement;
};
