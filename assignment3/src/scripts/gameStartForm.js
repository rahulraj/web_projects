/**
 * Constructor for a GameStartForm
 * @param {*} formElement the jQuery element wrapping
 *     the form.
 * @param {*} playButton the jQuery element wrapping 
 *     the button that starts the game.
 * @constructor
 */
othello.GameStartForm = function(formElement, playButton) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.playButton = playButton;
};

/**
 * Attach this form to a parent element, presumably to add it to
 * the document being displayed
 * @param {*} parentElement the parent for this form.
 */
othello.GameStartForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};

/**
 * Factory function to create a default form for Othello.
 * @return {othello.GameStartForm} a form asking who will play
 *     each side.
 */
othello.GameStartForm.createDefaultStartForm = function() {
  return new othello.GameStartForm.Builder().
    whitePlayerFieldset().
    blackPlayerFieldset().
    playButton().
    build();
};

/**
 * Constructor for a Builder for GameStartForms. Using a Builder
 * instead of hard coding the elements makes the form more
 * flexible.
 * @constructor
 */
othello.GameStartForm.Builder = function() {
  /** @const */ this.formElement = $('<form>');
  this.playButtonElement = othello.utils.None.instance;
};

/**
 * Add a fieldset to ask who will play white
 * @return {othello.GameStartForm.Builder} the Builder for chaining.
 */
othello.GameStartForm.Builder.prototype.whitePlayerFieldset = function() {
  /** @const */ var whiteFieldset =
      othello.PlayerFieldset.createWhitePlayerFieldset();
  whiteFieldset.attachTo(this.formElement);
  return this;
};

/**
 * Add a fieldset to ask who will play black
 * @return {othello.GameStartForm.Builder} the Builder for chaining.
 */
othello.GameStartForm.Builder.prototype.blackPlayerFieldset = function() {
  /** @const */ var blackFieldset =
      othello.PlayerFieldset.createBlackPlayerFieldset();
  blackFieldset.attachTo(this.formElement);
  return this;
};

/**
 * Add a button to start the game.
 * @return {othello.GameStartForm.Builder} the Builder for chaining.
 */
othello.GameStartForm.Builder.prototype.playButton = function() {
  this.playButtonElement = $('<input>', {
      type: 'button',
      value: 'Play!'
  });
  this.formElement.append(this.playButtonElement);
  return this;
};

/**
 * Build the form
 * @return {othello.GameStartForm} the newly built form.
 */
othello.GameStartForm.Builder.prototype.build = function() {
  return new othello.GameStartForm(this.formElement, this.playButtonElement);
};


/**
 * Class to represent a fieldset to choose who will play a side.
 * @param {*} fieldsetElement the element containing the
 *     fieldset, as a jQuery object.
 * @constructor
 */
othello.PlayerFieldset = function(fieldsetElement) {
  /** @const */ this.fieldsetElement = fieldsetElement;
};

/**
 * Attach this fieldset to a parent 
 * @param {*} parentElement the parent for this fieldset.
 */
othello.PlayerFieldset.prototype.attachTo = function(parentElement) {
  parentElement.append(this.fieldsetElement);
};

/**
 * Factory function to create a default fieldset for White
 * @return {othello.PlayerFieldset} a new fieldset.
 */
othello.PlayerFieldset.createWhitePlayerFieldset = function() {
  return othello.PlayerFieldset.createPlayerFieldset('White Player', 'white');
};

/**
 * Factory function to create a default fieldset for Black
 * @return {othello.PlayerFieldset} a new fieldset.
 */
othello.PlayerFieldset.createBlackPlayerFieldset = function() {
  return othello.PlayerFieldset.createPlayerFieldset('Black Player', 'black');
};

/**
 * Factory function to create an arbitrary player fieldset
 * @param {string} legendName the name for the legend element.
 * @param {string} color either 'white' or 'black'. 
 */
othello.PlayerFieldset.createPlayerFieldset = function(legendName, color) {
  return new othello.PlayerFieldset.Builder().id(color + 'Fieldset').
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
 * @constructor
 */
othello.PlayerFieldset.Builder = function() {
  /** @const */ this.fieldsetElement = $('<fieldset>');
};


/**
 * Set the ID of this.fieldsetElement
 * @param {string} idForFieldset the value for the ID.
 * @return {othello.PlayerFieldset.Builder} the Builder for chaining.
 */
othello.PlayerFieldset.Builder.prototype.id = function(idForFieldset) {
  this.fieldsetElement.attr('id', idForFieldset);
  return this;
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
 * TODO Name some of the anonymous objects to make the code cleaner.
 * @param {string} buttonName the name of the button.
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
