/**
 * A view class displaying the board as 2D nested divs.
 * @param {jQueryObject} parentDiv the element with the board.
 * @param {Array.<Array.<jQueryObject>>} innerDivs a 2D array
 *     of the divs's on the board.
 * @constructor
 * @const
 */
othello.BoardDivView = function(parentDiv, innerDivs) {
  /** @const */ this.parentDiv = parentDiv;
  /** @const */ this.innerDivs = innerDivs;
};


/**
 * Add onclick handlers to each of the divisions in this.
 * @param {function(number, number)} handler a handler function that takes
 *     the row and column of the division.
 * @const
 */
othello.BoardDivView.prototype.addClickHandlers = function(handler) {
  /** @const */ var self = this;
  _.each(_.range(0, self.innerDivs.length), function(i) {
    _.each(_.range(0, self.innerDivs[i].length), function(j) {
      self.innerDivs[i][j].bind('click', function(event) {
        handler(i, j);
      });
    });
  });
};


/**
 * Attach this element to a parent
 * @param {jQueryObject} parentElement this element's future parent.
 * @const
 */
othello.BoardDivView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.parentDiv);
};


/**
 * Named constructor. Given an othello.Board, create a div view
 * that can be displayed.
 * @param {othello.Board} board the board to display.
 * @param {othello.Piece} currentTurnPlayer the side that can move.
 * @return {othello.BoardDivView} a view of that board.
 * @const
 */
othello.BoardDivView.of = function(board, currentTurnPlayer) {
  /** @const */ var builder = new
      othello.BoardDivView.Builder().ofSize(othello.Board.size);
  _.each(_.range(0, othello.Board.size), function(i) {
    _.each(_.range(0, othello.Board.size), function(j) {
      /** @const */ var piece = board.pieceAt(i, j);
      if (piece !== othello.EmptyPiece.instance) {
        /** @const */ var playerClass =
            othello.BoardTableView.classOfPiece(piece);
        /** @const */ var pieceContainer = $('<span>',
            {'class': 'piece ' + playerClass});
        builder.at(i, j).append(pieceContainer);
      }
    });
  });

  /** @const */ var possibleMoveColorClass =
      othello.BoardTableView.classOfPiece(currentTurnPlayer);
  /** @const */ var moves = board.findPossibleMoves(currentTurnPlayer);
  _(moves).each(function(move) {
    /** @const */ var markerContainer = $('<span>',
        {'class': possibleMoveColorClass + ' possible-move'});
    builder.at(move.getX(), move.getY()).append(markerContainer);
  });

  return builder.build();
};


/**
 * @constructor
 */
othello.BoardDivView.Builder = function() {
  this.parentDiv = $('<div>', {id: 'othelloBoard'});
  this.innerDivs = null;
};

othello.BoardDivView.Builder.prototype.ofSize = function(size) {
  this.innerDivs = _.map(_.range(0, size), function(i) {
    return othello.BoardDivView.Builder.createRow(size);
  });
  return this;
};


/**
 * Helper function to create a table row.
 * @param {number} rowLength the length of the row.
 * @return {Array.<jQueryObject>} the table divisions in an array.
 * @const
 */
othello.BoardDivView.Builder.createRow = function(rowLength) {
  return _.map(_.range(0, rowLength), function(i) {
    return $('<div>', {'class': 'othelloBoardSquare'});
  });
};



/**
 * Set the Builder's position
 * @param {number} row the row.
 * @param {number} column the column.
 * @return {{append: function(jQueryObject): othello.BoardDivView.Builder,
 *           addClickHandler: function(function()):
 *               othello.BoardDivView.Builder}}
 *         An object containing functions operating on the division at
 *         the set position.
 * @const
 */
othello.BoardDivView.Builder.prototype.at = function(row, column) {
  /** @const */ var self = this;
  return {
    append: function(child) {
      self.innerDivs[row][column].append(child);
      return self;
    },

    addClickHandler: function(clickHandler) {
      self.innerDivs[row][column].bind('click', clickHandler);
      return self;
    }
  };
};


/**
 * Build the DivView
 * @return {othello.BoardTableView} the built table.
 * @const
 */
othello.BoardDivView.Builder.prototype.build = function() {
  /** @const */ var buildersParentDiv = this.parentDiv;
  _(this.innerDivs).each(function(row) {
    /** @const */ var firstDivInRow = row[0];
    firstDivInRow.addClass('firstDivInRow');
    /** @const */ var boardRow = $('<div>', {'class': 'boardRow'});
    _(row).each(function(division) {
      boardRow.append(division);
    });
    boardRow.append($('<div>', {'class': 'endOfRow'}));
    buildersParentDiv.append(boardRow);
  });
  return new othello.BoardDivView(buildersParentDiv, this.innerDivs);
};
