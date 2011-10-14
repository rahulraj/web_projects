


/**
 * A view class displaying the board as a HTML table
 * @param {jQueryObject} tableElement the element with the table.
 * @constructor
 * @const
 */
othello.BoardTableView = function(tableElement) {
  /** @const */ this.tableElement = tableElement;
};


/**
 * Attach this element to a parent
 * @param {jQueryObject} parentElement this element's future parent.
 * @const
 */
othello.BoardTableView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.tableElement);
};


/**
 * Named constructor. Given an othello.Board, create a table view
 * that can be displayed.
 * @param {othello.Board} board the board to display.
 * @param {othello.Piece} currentTurnPlayer the side that can move.
 * @return {othello.BoardTableView} a view of that board.
 * @const
 */
othello.BoardTableView.of = function(board, currentTurnPlayer) {
  /** @const */ var builder = new
      othello.BoardTableView.Builder().ofSize(othello.Board.size);
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
 * Helper function that converts a piece to a class string
 * @param {othello.Piece} piece the piece to convert.
 * @return {string} a class name to style the piece.
 */
othello.BoardTableView.classOfPiece = function(piece) {
  if (piece === othello.DarkPiece.instance) {
    return 'black-player';
  } else {
    return 'white-player';
  }
};



/**
 * Builder for table views
 * @constructor
 * @const
 */
othello.BoardTableView.Builder = function() {
  /** @const */ this.tableElement = $('<table>');
  this.tableDivisions = null;
};


/**
 * Set the table's size
 * @param {number} size the size for the table to be built.
 * @return {othello.BoardTableView.Builder} the Builder for chaining.
 * @const
 */
othello.BoardTableView.Builder.prototype.ofSize = function(size) {
  this.tableDivisions = _.map(_.range(0, size), function(i) {
    return othello.BoardTableView.Builder.createRow(size);
  });
  return this;
};


/**
 * Helper function to create a table row.
 * @param {number} rowLength the length of the row.
 * @return {Array.<jQueryObject>} the table divisions in an array.
 * @const
 */
othello.BoardTableView.Builder.createRow = function(rowLength) {
  return _.map(_.range(0, rowLength), function(i) {
    return $('<td>');
  });
};


/**
 * Set the Builder's position
 * @param {number} row the row.
 * @param {number} column the column.
 * @return {{append: function(jQueryObject): othello.BoardTableView.Builder,
 *           addClickHandler: function(function()):
 *               othello.BoardTableView.Builder}}
 *         An object containing functions operating on the division at
 *         the set position.
 * @const
 */
othello.BoardTableView.Builder.prototype.at = function(row, column) {
  /** @const */ var self = this;
  return {
    append: function(child) {
      self.tableDivisions[row][column].append(child);
      return self;
    },

    addClickHandler: function(clickHandler) {
      self.tableDivisions[row][column].bind('click', clickHandler);
      return self;
    }
  };
};


/**
 * Build the TableView
 * @return {othello.BoardTableView} the built table.
 * @const
 */
othello.BoardTableView.Builder.prototype.build = function() {
  /** @const */ var buildersTableElement = this.tableElement;
  _(this.tableDivisions).each(function(row) {
    /** @const */ var tableRow = $('<tr>');
    _(row).each(function(division) {
      tableRow.append(division);
    });
    buildersTableElement.append(tableRow);
  });
  return new othello.BoardTableView(buildersTableElement);
};
