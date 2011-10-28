shortener.onUserValidated = function() {
  $.getJSON(shortener.pagesUrl, function(data) {
    console.log(data);
    /** @const */ var pages = data.pages;
    /** @const */ var view = shortener.PageManagerView.of(pages);
    view.attachTo($('#main'));
  });
};

$(function() {
  /** @const */ var parentElement = $('#main');
  /** @const */ var loginForm = shortener.LoginForm.newForm();
  /** @const */ var registerForm =
      shortener.RegisterForm.newForm();

  /** @const */ var onLoginClick = function(username, password) {
    /** @const */ var postData = {
      username: username,
      password: password
    };
    $.post(shortener.loginUrl, postData, function(data) {
      if (data.success) {
        loginForm.fadeOut();
        registerForm.fadeOut();
        shortener.onUserValidated();
      } else {
        loginForm.displayMessage(data.message);
      }
    });
  };
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
        loginForm.fadeOut();
        registerForm.fadeOut();
        shortener.onUserValidated();
      } else {
        registerForm.displayMessage(data.message);
      }
    });
  };

  loginForm.submitClickEvent(onLoginClick);
  registerForm.submitClickEvent(onRegisterClick);
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
