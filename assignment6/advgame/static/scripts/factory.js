

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
    /** @const */ var terminalDiv = $('<div>', {id: 'terminal'});
    /** @const */ var prompt = data.prompt; 
    terminalDiv.terminal(function(command, terminal) {
      $.post(game.stepGameUrl, {userInput: command}, function(data) {
        /** @const */ var prompt = data.prompt; 
        terminal.echo(prompt);
      });
    }, {greetings: prompt, prompt: '>', name: 'game'});
    /** @const */ var anchorsList = $('<ul>');
    /** @const */ var logoutAnchor = $('<a>', {
      href: game.logoutUrl,
      html: 'Log out'
    });
    /** @const */ var logoutItem = $('<li>');
    logoutItem.append(logoutAnchor);
    /** @const */ var gameDefinerAnchor = $('<a>', {
      href: '#',
      html: 'Create game'
    });
    /** @const */ var definerItem = $('<li>');
    definerItem.append(gameDefinerAnchor);
    anchorsList.append(logoutItem).append(definerItem);
    gameDefinerAnchor.bind('click', function(event) {
      parentElement.html('');
      game.Factory.createGameDefiner(parentElement);
    });
    parentElement.append(terminalDiv).append(anchorsList);
  });
};

game.Factory.createGameDefiner = function(parentElement) {
  /** @const */ var description = $('<p>', {
    html: 'Define a game.' 
  });
  /** @const */ var textArea = $('<textarea>', {
    html: "def my_game(builder):\n  return builder. \\\n  #Your code here",
    cols: 80,
    rows: 30
  });
  /** @const */ var submitButton = $('<input>', {
    type: 'button',
    value: 'Submit'
  });
  parentElement.append(textArea).append(submitButton);
  submitButton.bind('click', function(event) {
    /** @const */ var data = textArea.val();
    console.log(data);
    $.post(game.defineGameUrl, {gameData: data}, function(event) {
      // Nothing to do here 
    });
  });
};
