shortener.FormFields = {};

shortener.FormFields.usernameField = function(parentElement) {
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
  return usernameFieldElement
};

shortener.FormFields.passwordField = function(parentElement, fieldName, label) {
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

shortener.FormFields.submitButton = function(parentElement, value) {
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
