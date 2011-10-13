


/**
 * A view class displaying the board as a HTML table
 * @param {jQuery} tableElement the element with the table.
 * @const
 * @constructor
 */
othello.BoardTableView = function(tableElement) {
  /** @const */ this.tableElement = tableElement;
};


/**
 * Attach this element to a parent
 * @param {jQuery} parentElement this element's future parent.
 * @const
 */
othello.BoardTableView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.tableElement);
};


/**
 * Named constructor. Given an othello.Board, create a table view
 * that can be displayed.
 * @param {othello.Board} board the board to display.
 * @return {othello.BoardTableView} a view of that board.
 * @const
 */
othello.BoardTableView.of = function(board) {
  /** @const */ var builder = new
      othello.BoardTableView.Builder().ofSize(othello.Board.size);
  _.each(_.range(0, othello.Board.size), function(i) {
    _.each(_.range(0, othello.Board.size), function(j) {
      /** @const */ var playerClass;
      if (board.pieceAt(i, j) === othello.DarkPiece.instance) {
        playerClass = 'black-player';
      } else if (board.pieceAt(i, j) === othello.LightPiece.instance) {
        playerClass = 'white-player';
      }
      if (playerClass) {
        /** @const */ var pieceContainer = $('<span>',
            {'class': 'piece ' + playerClass});
        builder.at(i, j).append(pieceContainer);
      }
    });
  });
  return builder.build();
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
 * @return {Array.<jQuery>} the table divisions in an array.
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
 * @return {{append: function(jQuery}: BoardTableView.Builder,
 *           addClickHandler: function(function()): BoardTableView.Builder}}
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
