


/**
 * Class representing a GUI to manage the pages created by a user.
 * @param {jQueryObject} viewElement the element containing the view.
 * @param {jQueryObject} urlToShortenField the field containing inputs
 *     asking the shorten the URL.
 * @param {jQueryObject} outputUrlField a field where the user can specify
 *     a shorter version if desired.
 * @param {jQueryObject} shortenButton the button to click to shorten URLs.
 * @param {jQueryObject} messageElement the element in which to leave messages
 *     to the user.
 * @constructor
 * @const
 */
shortener.PageManagerView = function(viewElement, urlToShortenField,
    outputUrlField, shortenButton, messageElement)  {
  /** @const */ this.viewElement = viewElement;
  /** @const */ this.urlToShortenField = urlToShortenField;
  /** @const */ this.outputUrlField = outputUrlField;
  /** @const */ this.shortenButton = shortenButton;
  /** @const */ this.messageElement = messageElement;
};


/**
 * Attach this to a parent.
 * @param {jQueryObject} parentElement the parent for this element.
 * @const
 */
shortener.PageManagerView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.viewElement);
};


/**
 * Set a handler function for clicks on the shorten button.
 * @param {function(string, string)} handler a function to call. The
 *     entered URL and desired shortened version will be passed in.
 */
shortener.PageManagerView.prototype.submitClickEvent = function(handler) {
  /** @const */ var self = this;
  this.shortenButton.bind('click', function(event) {
    /** @const */ var urlToShorten = self.urlToShortenField.val();
    /** @const */ var outputUrl = self.outputUrlField.val();
    handler(urlToShorten, outputUrl);
  });
};


/**
 * Show a message to the user.
 * @param {string} message the message to show.
 * @const
 */
shortener.PageManagerView.prototype.showMessage = function(message) {
  this.messageElement.html(message);
};


/**
 * Factory function to create a new view.
 * @param {Array.<shortener.PageJson>} pagesAsJson an array of
 *     JSON objects from the server describing the format.
 * @return {shortener.PageManagerView} the new view.
 * @const
 */
shortener.PageManagerView.of = function(pagesAsJson) {
  return new shortener.PageManagerView.Builder().
      urlToShortenField().
      outputUrlField().
      shortenButton().
      of(pagesAsJson).
      build();
};



/**
 * Builder for a PageManagerView
 * @constructor
 * @const
 */
shortener.PageManagerView.Builder = function() {
  /** @const */ this.viewElement = $('<div>');
  /** @const */ this.viewList = $('<ul>', {id: 'pageManager'});
  /** @const */ this.messageElement = $('<p>');
  this.urlToShortenFieldElement = null;
  this.outputUrlFieldElement = null;
  this.shortenButtonElement = null;
};


/**
 * Add a url to shorten field
 * @return {shortener.PageManagerView.Builder} the Builder for chaining.
 * @const
 */
shortener.PageManagerView.Builder.prototype.urlToShortenField = function() {
  /** @const */ var urlToShortenLabel = $('<label>', {
    'for': 'urlToShorten',
    html: 'Shorten'
  });
  this.urlToShortenFieldElement = $('<input>', {
    type: 'text',
    name: 'urlToShorten',
    value: ''
  });
  this.viewElement.append(urlToShortenLabel).
      append(this.urlToShortenFieldElement);
  return this;
};


/**
 * Add an output url field.
 * @return {shortener.PageManagerView.Builder} the Builder for chaining.
 * @const
 */
shortener.PageManagerView.Builder.prototype.outputUrlField = function() {
  /** @const */ var outputLabel = $('<label>', {
    'for': 'outputUrl',
    html: 'to (leave blank for autogenerated URL)'
  });
  this.outputUrlFieldElement = $('<input>', {
    type: 'text',
    name: 'outputUrl',
    value: ''
  });
  this.viewElement.append(outputLabel).append(this.outputUrlFieldElement);
  return this;
};


/**
 * Add a shorten button
 * @return {shortener.PageManagerView.Builder} the Builder for chaining.
 * @const
 */
shortener.PageManagerView.Builder.prototype.shortenButton = function() {
  this.shortenButtonElement = $('<input>', {
    type: 'button',
    name: 'submit',
    value: 'Shorten'
  });
  this.viewElement.append(this.shortenButtonElement);
  return this;
};


/**
 * Helper function to add the heading for a PageManagerView
 * @const
 */
shortener.PageManagerView.Builder.prototype.addHeading = function() {
  /** @const */ var headingListItem = $('<li>');
  /** @const */ var originalUrlLabel = $('<span>', {
    html: 'Original URL',
    'class': 'grid_4'
  });
  /** @const */ var shortenedUrlLabel = $('<span>', {
    html: 'Shortened URL',
    'class': 'grid_4'
  });
  /** @const */ var analyticsLabel = $('<span>', {
    html: 'Analytics',
    'class': 'grid_4'
  });
  /** @const */ var clearDiv = $('<div>', {'class': 'clear'});
  this.viewList.append(originalUrlLabel).append(shortenedUrlLabel).
      append(analyticsLabel).append(clearDiv);
};


/**
 * Add the page data.
 * @param {Array.<shortener.PageJson>} pagesAsJson a list of the
 *     the describing JSON objects.
 * @return {shortener.PageManagerView.Builder} the Builder for chaining.
 * @const
 */
shortener.PageManagerView.Builder.prototype.of = function(pagesAsJson) {
  this.addHeading();
  /** @const */ var viewList = this.viewList;
  _(pagesAsJson).each(function(pageAsJson) {
    /** @const */ var pageListItem = $('<li>');
    /** @const */ var originalUrlAnchor = $('<a>', {
      href: 'http://' + pageAsJson.originalUrl,
      html: pageAsJson.originalUrl,
      'class': 'grid_4'
    });
    /** @const */ var shortenedUrlAnchor = $('<a>', {
      href: shortener.rootUrl + pageAsJson.shortenedUrl,
      html: shortener.rootUrl + pageAsJson.shortenedUrl,
      'class': 'grid_4'
    });
    /** @const */ var numberOfAnalytics = $('<span>', {
      html: pageAsJson.visits.length,
      'class': 'grid_4'
    });
    /** @const */ var analyticsList = $('<ul>');
    if (pageAsJson.visits.length === 0) {
      /** @const */ var visitMessage = $('<li>', {
        html: 'No visits yet :('
      });
      analyticsList.append(visitMessage);
    }
    else {
      analyticsList.append($('<li>', {
        html: pageAsJson.sinceLastHour + ' visit(s) in the last hour'
      }));
      analyticsList.append($('<li>', {
        html: pageAsJson.sinceLastDay  + ' visit(s) in the last day'
      }));
      analyticsList.append($('<li>', {
        html: pageAsJson.sinceLastWeek + ' visit(s) in the last week'
      }));
      analyticsList.append($('<li>', {
        html: pageAsJson.sinceLastMonth + ' visit(s) in the last month'
      }));
      analyticsList.append($('<li>', {
        html: pageAsJson.sinceLastYear + ' visit(s) in the last year'
      }));
      analyticsList.append($('<li>', {
        html: 'The exact visit times are: '
      }));
      _(pageAsJson.visits).each(function(visit) {
        /** @const */ var visitItem = $('<li>', {
          html: visit.timeVisited
        });
        analyticsList.append(visitItem);
      });
    }
    analyticsList.hide();
    /** @const */ var detailsButton = $('<input>', {
      type: 'button',
      value: 'Show Details'
    });
    detailsButton.bind('click', function(event) {
      analyticsList.slideToggle();
      /** @const */ var action = detailsButton.val() === 'Show Details' ?
          'Hide Details' : 'Show Details';
      detailsButton.val(action);
    });
    numberOfAnalytics.append(detailsButton);
    numberOfAnalytics.append(analyticsList);

    /** @const */ var clearDiv = $('<div>', {'class': 'clear'});
    pageListItem.append(originalUrlAnchor).append(shortenedUrlAnchor).
        append(numberOfAnalytics).append(clearDiv);
    viewList.append(pageListItem);
  });
  return this;
};


/**
 * Build the PageManagerView.
 * @return {shortener.PageManagerView} the new view.
 * @const
 */
shortener.PageManagerView.Builder.prototype.build = function() {
  this.viewElement.append(this.messageElement);
  this.viewElement.append($('<h2>', {html: 'Your Pages'}));
  this.viewElement.append(this.viewList);
  this.viewElement.append($('<a>', {
    href: shortener.logoutUrl,
    html: 'Log out'
  }));
  return new shortener.PageManagerView(this.viewElement,
      this.urlToShortenFieldElement, this.outputUrlFieldElement,
      this.shortenButtonElement, this.messageElement);
};
