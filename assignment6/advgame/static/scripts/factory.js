

/** @const */ game.Factory = {};


/**
 * Call this when a form is submitted successfully.
 * @param {game.LoginForm} loginForm the login form.
 * @param {game.RegisterForm} registerForm the register form.
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
game.Factory.onAuthentication =
    function(loginForm, registerForm, parentElement) {
  loginForm.fadeOut();
  registerForm.fadeOut();
  game.Factory.createGameTerminal(parentElement);
};


/**
 * Call this when the application starts.
 * @param {boolean} loggedIn whether the user is logged in.
 * @param {jQueryObject} parentElement the parent element for UI elements.
 * @const
 */
game.Factory.onStart = function(loggedIn, parentElement) {
  if (loggedIn) {
    game.Factory.createGameTerminal(parentElement);
  } else {
    /** @const */ var forms =
        game.Factory.createInitialForms(parentElement);
    game.Factory.attachForms(forms, parentElement);
  }
};


/**
 * Create the initial set of forms and return them.
 * @param {jQueryObject} parentElement the parent for the forms.
 * @return {Array.<*>} a tuple with the login and register forms.
 * @const
 */
game.Factory.createInitialForms = function(parentElement) {
  /** @const */ var loginForm = game.LoginForm.newForm();
  /** @const */ var registerForm =
      game.RegisterForm.newForm();

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
    $.post(game.loginUrl, postData, function(data) {
      if (data.success) {
        game.Factory.onAuthentication(
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
    $.post(game.addUserUrl, postData, function(data) {
      if (data.success) {
        game.Factory.onAuthentication(
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
game.Factory.attachForms = function(forms, parentElement) {
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
 * Create a terminal and play the game.
 * @param {jQueryObject} parentElement the parent.
 * @const
 */
game.Factory.createGameTerminal = function(parentElement) {
  // start the game to get the initial message
  $.post(game.newGameUrl, {}, function(data) {
    console.log('started a new game');
    /** @const */ var prompt = data.prompt; 
    /** @const */ var terminalDiv = $('<div>', {
      id: 'terminal'
    });
    parentElement.append(terminalDiv);
    terminalDiv.terminal(function(command, terminal) {
      $.post(game.stepGameUrl, {userInput: command}, function(data) {
        /** @const */ var prompt = data.prompt; 
        terminal.echo(prompt);
      });
    }, {greetings: prompt, prompt: '>', name: 'game'});
  });
};
