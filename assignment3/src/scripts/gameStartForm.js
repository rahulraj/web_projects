


/**
 * Constructor for a GameStartForm
 * @param {jQueryObject} formElement the jQuery element wrapping
 *     the form.
 * @param {jQueryObject} playButton the jQuery element wrapping
 *     the button that starts the game.
 * @constructor
 * @const
 */
othello.GameStartForm = function(formElement, playButton) {
  /** @const */ this.formElement = formElement;
  /** @const */ this.playButton = playButton;
};


/**
 * Attach this form to a parent element, presumably to add it to
 * the document being displayed
 * @param {jQueryObject} parentElement the parent for this form.
 * @const
 */
othello.GameStartForm.prototype.attachTo = function(parentElement) {
  parentElement.append(this.formElement);
};


/**
 * Add a click handler for the play button
 * @param {function()} handler the function to call.
 * @const
 */
othello.GameStartForm.prototype.addPlayButtonClickHandler =
    function(handler) {
  this.playButton.click(handler);
};


/**
 * Get the string associated with the user's choice for the black player.
 * @return {string} the choice the user made.
 * @const
 */
othello.GameStartForm.prototype.blackPlayerSelection = function() {
  /** @const */ var selected = $('input').filter(function() {
    /** @const */ var element = $(this);
    return element.attr('type') === 'radio' &&
           element.attr('name') === 'blackPlayer' &&
           element.attr('checked') === 'checked';
  });
  return selected.attr('id');
};


/**
 * Get the string associated with the user's choice for the white player.
 * @return {string} the choice the user made.
 * @const
 */
othello.GameStartForm.prototype.whitePlayerSelection = function() {
  /** @const */ var selected = $('input').filter(function() {
    /** @const */ var element = $(this);
    return element.attr('type') === 'radio' &&
           element.attr('name') === 'whitePlayer' &&
           element.attr('checked') === 'checked';
  });
  return selected.attr('id');
};


/**
 * Factory function to create a default form for Othello.
 * @return {othello.GameStartForm} a form asking who will play
 *     each side.
 * @const
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
 * @const
 */
othello.GameStartForm.Builder = function() {
  /** @const */ this.formElement = $('<form>');
  this.playButtonElement = othello.utils.None.instance;
};


/**
 * Add a fieldset to ask who will play white
 * @return {othello.GameStartForm.Builder} the Builder for chaining.
 * @const
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
 * @const
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
 * @const
 */
othello.GameStartForm.Builder.prototype.playButton = function() {
  this.playButtonElement = new othello.utils.Some($('<input>', {
    type: 'button',
    value: 'Play!'
  }));
  this.formElement.append(this.playButtonElement.getOrElse(null));
  return this;
};


/**
 * Build the form
 * @return {othello.GameStartForm} the newly built form.
 * @const
 */
othello.GameStartForm.Builder.prototype.build = function() {
  /** @const */ var playButton = /** @type {jQueryObject} */
      (this.playButtonElement.getOrElse(null));
  if (!playButton) {
    throw new Error('Tried to build a start form without a play button');
  }
  return new othello.GameStartForm(this.formElement, playButton);
};



/**
 * Class to represent a fieldset to choose who will play a side.
 * @param {*} fieldsetElement the element containing the
 *     fieldset, as a jQuery object.
 * @constructor
 * @const
 */
othello.PlayerFieldset = function(fieldsetElement) {
  /** @const */ this.fieldsetElement = fieldsetElement;
};


/**
 * @const
 * @type {string}
 */
othello.PlayerFieldset.humanButtonId = 'Human';


/**
 * @const
 * @type {string}
 */
othello.PlayerFieldset.easyAiButtonId = 'EasyAi';


/**
 * @const
 * @type {string}
 */
othello.PlayerFieldset.mediumAiButtonId = 'MediumAi';


/**
 * @const
 * @type {string}
 */
othello.PlayerFieldset.hardAiButtonId = 'HardAi';


/**
 * Attach this fieldset to a parent
 * @param {*} parentElement the parent for this fieldset.
 * @const
 */
othello.PlayerFieldset.prototype.attachTo = function(parentElement) {
  parentElement.append(this.fieldsetElement);
};


/**
 * Factory function to create a default fieldset for White
 * @return {othello.PlayerFieldset} a new fieldset.
 * @const
 */
othello.PlayerFieldset.createWhitePlayerFieldset = function() {
  return othello.PlayerFieldset.createPlayerFieldset('White Player', 'white');
};


/**
 * Factory function to create a default fieldset for Black
 * @return {othello.PlayerFieldset} a new fieldset.
 * @const
 */
othello.PlayerFieldset.createBlackPlayerFieldset = function() {
  return othello.PlayerFieldset.createPlayerFieldset('Black Player', 'black');
};


/**
 * Factory function to create an arbitrary player fieldset
 * @param {string} legendName the name for the legend element.
 * @param {string} color either 'white' or 'black'.
 * @return {othello.PlayerFieldset} the created Fieldset.
 * @const
 */
othello.PlayerFieldset.createPlayerFieldset = function(legendName, color) {
  return new othello.PlayerFieldset.Builder().id(color + 'Fieldset').
      legend(legendName).
      radioButtonSetNamed(color + 'Player').
          radioButton(color + othello.PlayerFieldset.humanButtonId).
              withLabel('Human').
          radioButton(color + othello.PlayerFieldset.easyAiButtonId).
              withLabel('Easy AI').
          radioButton(color + othello.PlayerFieldset.mediumAiButtonId).
              withLabel('Medium AI').
          radioButton(color + othello.PlayerFieldset.hardAiButtonId).
              withLabel('Hard AI').build();
};



/**
 * Initialize a PlayerFieldset Builder. Call the provided
 * methods to build the fieldset. Note that order does matter,
 * the order in which methods are called will be the order in
 * which elements are displayed in the resulting document.
 * @constructor
 * @const
 */
othello.PlayerFieldset.Builder = function() {
  /**
   * @const
   * @type {jQueryObject}
   */
  this.fieldsetElement = $('<fieldset>');
};


/**
 * Set the ID of this.fieldsetElement
 * @param {string} idForFieldset the value for the ID.
 * @return {othello.PlayerFieldset.Builder} the Builder for chaining.
 * @const
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
 * @const
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
 * @param {string} buttonName the name of the button.
 * @return {*} an object supporting the functions from the given example.
 * @const
 */
othello.PlayerFieldset.Builder.prototype.radioButtonSetNamed =
    function(buttonName) {
  /** @const */ var fieldsetElement = this.fieldsetElement;
  /** @const */ var fieldsetUnorderedList = $('<ul>');
  fieldsetElement.append(fieldsetUnorderedList);
  var checked = false;
  /** @const */ var radioButtonBuilder = {
    /**
     * Add a radio button
     * @return {*} a buttonDetailBuilder.
     * @const
     */
    radioButton: function(buttonId) {
      /** @const */ var buttonListItem = $('<li>');
      fieldsetUnorderedList.append(buttonListItem);
      /** @const */ var buttonDetailBuilder = {
        /**
         * Check the radio button. Not used right now, it appears
         * to mess up further selection by not unchecking the first button.
         * @return {*} the buttonDetailBuilder.
         * @const
         */
        checked: function() {
          checked = true;
          return buttonDetailBuilder;
        },

        /**
         * Add a label to a button.
         * @return {*} the radioButtonBuilder.
         * @const
         */
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
          buttonListItem.append(radioElement).append(labelElement);
          return radioButtonBuilder;
        }
      };
      return buttonDetailBuilder;
    },

    /**
     * Build the fieldset
     * @return {othello.PlayerFieldset} the new Fieldset.
     * @const
     */
    build: function() {
      return new othello.PlayerFieldset(fieldsetElement);
    }
  };
  return radioButtonBuilder;
};
