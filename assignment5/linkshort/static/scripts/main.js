$(function() {
  /** @const */ var parentElement = $('#main');
  /** @const */ var loginForm = shortener.LoginForm.newForm();
  /** @const */ var registerForm = shortener.RegisterForm.newForm();
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
