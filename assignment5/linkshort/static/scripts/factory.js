/** @const */ shortener.Factory = {};

shortener.Factory.onAuthentication =
    function(loginForm, registerForm, parentElement) {
  loginForm.fadeOut();
  registerForm.fadeOut();
  shortener.Factory.createPageManager(parentElement);
};

shortener.Factory.onStart = function(loggedIn, parentElement) {
  if (loggedIn) {
    shortener.Factory.createPageManager(parentElement); 
  } else {
    /** @const */ var forms =
        shortener.Factory.createInitialForms(parentElement);  
    shortener.Factory.attachForms(forms, parentElement);
  }
};

shortener.Factory.createInitialForms = function(parentElement) {
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
        shortener.Factory.onAuthentication(
            loginForm, registerForm, parentElement);
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
      if (data.success) {
        shortener.Factory.onAuthentication(
            loginForm, registerForm, parentElement);
      } else {
        registerForm.displayMessage(data.message);
      }
    });
  };

  loginForm.submitClickEvent(onLoginClick);
  registerForm.submitClickEvent(onRegisterClick);
  return [loginForm, registerForm];
};

shortener.Factory.attachForms = function(forms, parentElement) {
  /** @const */ var loginForm = forms[0];
  /** @const */ var registerForm = forms[1];
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
};

shortener.Factory.createPageManager = function(parentElement) {
  /** @const */ var drawPage = function(data) {
    parentElement.html('');
    /** @const */ var pages = data.pages;
    /** @const */ var view = shortener.PageManagerView.of(pages);
    /** @const */ var onShortenClick = function(originalUrl, outputUrl) {
      /** @const */ var postData = {
        originalUrl: originalUrl,
        outputUrl: outputUrl
      };
      $.post(shortener.pagesUrl, postData, function(result) {
        if (result.success) {
          $.getJSON(shortener.pagesUrl, function(data) {
            // Recur asynchronously to update the page.
            drawPage(data);
          });
        } else {
          view.showMessage('Failed: ' + result.message);
        }
      });
    };
    view.submitClickEvent(onShortenClick);
    view.attachTo(parentElement);
  };
  $.getJSON(shortener.pagesUrl, function(data) {
    drawPage(data);
  });
};
