$(function() {
  /** @const */ var parentElement = $('#main');
  /** @const */ var loginForm = shortener.LoginForm.newForm();
  /** @const */ var registerForm = shortener.RegisterForm.newForm();
  /** @const */ var loginDiv = $('<div>', {
    'class': 'grid_6'
  });
  loginDiv.append($('<p>', {html: 'Have an account? Log in here.'}));
  /** @const */ var registerDiv = $('<div>', {
    'class': 'grid_6'
  });
  registerDiv.append($('<p>', {html: 'First time? Register here.'}));
  loginForm.attachTo(loginDiv);
  registerForm.attachTo(registerDiv);
  /** @const */ var clearDiv = $('<div>', {
    'class': 'clear'
  });
  parentElement.append(loginDiv).append(registerDiv).append(clearDiv);
});
