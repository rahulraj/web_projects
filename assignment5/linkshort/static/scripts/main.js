$(function() {
  /** @const */ var parentElement = $('#main');
  /** @const */ var initialForms =
      shortener.Factory.createInitialForms(parentElement);
  /** @const */ var loginForm = initialForms[0];
  /** @const */ var registerForm = initialForms[1];

  /** @const */ var loginDiv = $('<div>', {
    'class': 'grid_6'
  });
  /** @const */ var registerDiv = $('<div>', {
    'class': 'grid_6'
  });
  loginForm.attachTo(loginDiv);
  registerForm.attachTo(registerDiv);
  /** @const */ var clearDiv = $('<div>', {
    'class': 'clear'
  });
  parentElement.append(loginDiv).append(registerDiv).append(clearDiv);
});
