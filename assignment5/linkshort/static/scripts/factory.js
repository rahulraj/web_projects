

/** @const */ shortener.Factory = {};


/**
 * Call this when a form is submitted successfully.
 * @param {shortener.LoginForm} loginForm the login form.
 * @param {shortener.RegisterForm} registerForm the register form.
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
shortener.Factory.onAuthentication =
    function(loginForm, registerForm, parentElement) {
  loginForm.fadeOut();
  registerForm.fadeOut();
  shortener.Factory.createPageManager(parentElement);
};


/**
 * Call this when the application starts.
 * @param {boolean} loggedIn whether the user is logged in.
 * @param {jQueryObject} parentElement the parent element for UI elements.
 * @const
 */
shortener.Factory.onStart = function(loggedIn, parentElement) {
  if (loggedIn) {
    shortener.Factory.createPageManager(parentElement);
  } else {
    /** @const */ var forms =
        shortener.Factory.createInitialForms(parentElement);
    shortener.Factory.attachForms(forms, parentElement);
  }
};


/**
 * Create the initial set of forms and return them.
 * @param {jQueryObject} parentElement the parent for the forms.
 * @return {Array.<*>} a tuple with the login and register forms.
 * @const
 */
shortener.Factory.createInitialForms = function(parentElement) {
  /** @const */ var loginForm = shortener.LoginForm.newForm();
  /** @const */ var registerForm =
      shortener.RegisterForm.newForm();

  /**
   * Function to call when the login button is clicked
   * @param {string} username the username.
   * @param {string} password the password.
   * @const
   */
  var onLoginClick = function(username, password) {
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
  /**
   * Function to call when the register button is clicked
   * @param {string} username the username.
   * @param {string} password the password.
   * @param {string} confirmPassword the confirmation.
   * @const
   */
  var onRegisterClick = function(username, password, confirmPassword) {
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


/**
 * Attach the forms to the parent.
 * @param {Array.<*>} forms the forms.
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
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


/**
 * Create the page manager GUI
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
shortener.Factory.createPageManager = function(parentElement) {
  /**
   * Function to call after receiving JSON from the server
   * @param {*} data a JSON record containing the user's pages.
   * @const
   */
  var drawPage = function(data) {
    parentElement.html('');
    /** @const */ var pages = data.pages;
    /** @const */ var view = shortener.PageManagerView.of(pages);
    /**
     * Function to call when the shorten button is clicked
     * @param {string} originalUrl the original url.
     * @param {string} outputUrl the desired shorter URL, or blank
     *     to autogenerate one.
     * @const
     */
    var onShortenClick = function(originalUrl, outputUrl) {
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
