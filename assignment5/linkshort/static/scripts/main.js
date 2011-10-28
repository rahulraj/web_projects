$(function() {
  /** @const */ var parentElement = $('#main');
  /** @const */ var loginForm = shortener.LoginForm.newForm();
  /** @const */ var onLoginClick = function(username, password) {
    /** @const */ var postData = {
      username: username,
      password: password
    };
    $.post(shortener.loginUrl, postData, function(data) {
      if (data.success) {
        loginForm.displayMessage(
            'youre logged in, but this is not implemented yet');
      } else {
        loginForm.displayMessage(data.message);
      }
    });
  };
  loginForm.submitClickEvent(onLoginClick);

  /** @const */ var registerForm =
      shortener.RegisterForm.newForm();
  /** @const */ var onRegisterClick =
      function(username, password, confirmPassword) {
    /** @const */ var postData = {
      username: username,
      password: password,
      confirmPassword: confirmPassword
    };
    $.post(shortener.addUserUrl, postData, function(data) {
      console.log(data);
      if (data.success) {
        registerForm.displayMessage(
            'Youre registered, but not implemented yet');
      } else {
        registerForm.displayMessage(data.message);
      }
    });
  };
  registerForm.submitClickEvent(onRegisterClick);
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
