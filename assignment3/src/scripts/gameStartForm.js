othello.GameStartForm = function(formElement, playButton) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.playButton = playButton;
};

othello.GameStartForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};

othello.GameStartForm.createDefaultStartForm = function() {
  return new othello.GameStartForm.Builder().
    whitePlayerFieldset().
    blackPlayerFieldset().
    playButton().
    build();
};

othello.GameStartForm.Builder = function() {
  /** @const */ this.formElement = $('<form>');
  this.playButtonElement = othello.utils.None.instance;
};

othello.GameStartForm.Builder.prototype.whitePlayerFieldset = function() {
  /** @const */ var whiteFieldset =
      othello.PlayerFieldset.createWhitePlayerFieldset();
  whiteFieldset.attachTo(this.formElement);
  return this;
};

othello.GameStartForm.Builder.prototype.blackPlayerFieldset = function() {
  /** @const */ var blackFieldset =
      othello.PlayerFieldset.createBlackPlayerFieldset();
  blackFieldset.attachTo(this.formElement);
  return this;
};

othello.GameStartForm.Builder.prototype.playButton = function() {
  this.playButtonElement = $('<input>', {
      type: 'button',
      value: 'Play!'
  });
  this.formElement.append(this.playButtonElement);
  return this;
};

othello.GameStartForm.Builder.prototype.build = function() {
  return new othello.GameStartForm(this.formElement, this.playButtonElement);
};


othello.PlayerFieldset = function(fieldsetElement) {
  /** @const */ this.fieldsetElement = fieldsetElement;
};

othello.PlayerFieldset.prototype.attachTo = function(parentElement) {
  parentElement.append(this.fieldsetElement);
};

othello.PlayerFieldset.createWhitePlayerFieldset = function() {
  return othello.PlayerFieldset.createPlayerFieldset('White Player', 'white');
};

othello.PlayerFieldset.createBlackPlayerFieldset = function() {
  return othello.PlayerFieldset.createPlayerFieldset('Black Player', 'black');
};

othello.PlayerFieldset.createPlayerFieldset = function(legendName, color) {
  return new othello.PlayerFieldset.Builder().
      legend(legendName).
      radioButtonSetNamed(color + 'Player').
          radioButton(color + 'Human').checked().withLabel('Human').
          radioButton(color + 'EasyAi').withLabel('Easy AI').
          radioButton(color + 'MediumAi').withLabel('Medium AI').build();
};

/**
 * Initialize a PlayerFieldset Builder. Call the provided
 * methods to build the fieldset. Note that order does matter,
 * the order in which methods are called will be the order in
 * which elements are displayed in the resulting document.
 */
othello.PlayerFieldset.Builder = function() {
  /** @const */ this.fieldsetElement = $('<fieldset>');
};

/**
 * Add a legend to the top.
 * @param {string} legendName the name for the legend.
 * @return {othello.PlayerFieldset.Builder} this Builder for
 *     chaining.
 */
othello.PlayerFieldset.Builder.prototype.legend = function(legendName) {
  /** @const */ var legendHtml = $('<legend>', {html: legendName});
  this.fieldsetElement.append(legendHtml);
  return this;
};

/**
 * Creates a set of radio buttons. Uses nested closures to provide
 * a more fluent interface. Usage:
 * builder.radioButtonSetNamed('whitePlayer').
 *     radioButton('whiteHuman').checked().withLabel('Human').
 *     radioButton('whiteEasyAi').withLabel('Easy AI').
 *     radioButton('whiteMediumAi').withLabel('Medium AI').build();
 */
othello.PlayerFieldset.Builder.prototype.radioButtonSetNamed =
    function(buttonName) {
  /** @const */ var fieldsetElement = this.fieldsetElement;
  var checked = false;
  /** @const */ var radioButtonBuilder = {
      radioButton: function(buttonId) {
        /** @const */ var buttonDetailBuilder = {
          checked: function() {
            checked = true;
            return buttonDetailBuilder;
          },

          withLabel: function(labelHtml) {
            /** @const */ var radioButtonAttributes = {
                type: 'radio',
                name: buttonName,
                id: buttonId
            };
            if (checked) {
              radioButtonAttributes['checked'] = 'checked';
              checked = false;
            }
            /** @const */ var radioElement = $('<input>',
                radioButtonAttributes);
            /** @const */ var labelElement = $('<label>', {
                'for': buttonId,
                html: labelHtml
            });
            fieldsetElement.append(radioElement).append(labelElement);
            return radioButtonBuilder;
          }
        };
        return buttonDetailBuilder;
      },
          
      build: function() {
        return new othello.PlayerFieldset(fieldsetElement);
      }
  };
  return radioButtonBuilder;
};
