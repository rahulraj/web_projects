othello.BoardTableView = function(tableElement) {
  /** @const */ this.tableElement = tableElement;
};

othello.BoardTableView.prototype.attachTo = function(parentElement) {
  parentElement.append(this.tableElement);
};

/**
 * Named constructor. Given an othello.Board, create a table view 
 * that can be displayed.
 * @param {othello.Board} board the board to display.
 * @return {othello.BoardTableView} a view of that board.
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

othello.BoardTableView.Builder = function() {
  /** @const */ this.tableElement = $('<table>');
  this.tableDivisions = null;
};

othello.BoardTableView.Builder.prototype.ofSize = function(size) {
  this.tableDivisions =  _.map(_.range(0, size), function(i) {
    return othello.BoardTableView.Builder.createRow(size);
  });
  return this;
};

othello.BoardTableView.Builder.createRow = function(rowLength) {
  return _.map(_.range(0, rowLength), function(i) {
    return $('<td>');
  });
};

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
