//
// Tic Tac Toe 
//


//
// Initialization after the page is loaded
//
$(document).ready(function () {
	var boardSize = 9;
	var outcome = { "draw":"It's a draw!", "win":"I win!", "lose":"You beat me"};
	// create elements
	var elements = Array.dim(boardSize).map(function () {
		// use jquery so that we have jq objects and not elements
		var box = $("<div>");
		box.addClass("box");
		$("#board").append(box);
		return box;
	});

	// create a new board
	var board = new Board(boardSize);

	// attach render methods to elements
	elements.forEach(function (e) {
		e.render = function (player) {
			if (player === board.getPlayer(1))
				e.addClass("player1");
			else
				e.addClass("player2");
		};		
	});


	// attach play methods to elements
	elements.forEach(function (e, position) {
		e.play = function (player) {	
			if (board.play(player, position)) {
				e.render(player);
				return true;
			}
			return false;								 
		};
	});
	
	// display the outcome of the game
	var displayOutcome = function(player, win) {
		if (win) 
			$("#outcome").text((player === humanPlayer) ? outcome.lose : outcome.win);
		else
			$("#outcome").text(outcome.draw);		
	};
	
	// add listeners for the click event on each element
	// let the event handler call play on the element,
	// check if the game is over, and make the move of the 
	// computer player
	var humanPlayer = board.getPlayer(Math.round(Math.random()) + 1);
	var computerPlayer = humanPlayer.other;
	elements.forEach(function (e) {
		e.click(function () {
			// if the game is already complete, nothing to do
			if (board.isGameOver(humanPlayer, displayOutcome)) return;
			
			if (e.play(humanPlayer)) {				
				if (board.isGameOver(humanPlayer, displayOutcome)) return;

				elements[board.bestPlayPosition(computerPlayer)].play(computerPlayer);					
				board.isGameOver(computerPlayer, displayOutcome);
			}									
		});
	});
	
	// if the computer is first to go, find the best move and play
	if (computerPlayer === board.getPlayer(1))
		elements[board.bestPlayPosition(computerPlayer)].play(computerPlayer);					
	
});

//
// Implementation of the Board ADT 
// Contains all the game logic
//
var Board = function (boardSize) {
	var PLAYER_1 = {}, PLAYER_2 = {}, NONE = {};
	PLAYER_1.other = PLAYER_2;
	PLAYER_2.other = PLAYER_1;
	
	// for debugging
	PLAYER_1.toString = function() {return "X";};
	PLAYER_2.toString = function() {return "O";};
	NONE.toString = function() {return "-";};
    
	var board = Array.dim(boardSize, NONE);
	
	var winningLines = [[0,1,2], [3,4,5], [6,7,8],
					    [0,3,6], [1,4,7], [2,5,8],
 	    				[0,4,8], [2,4,6]];
	
	// returns true if player has won, false otherwise
	var hasWon = function (board, player) {
		// check if won
		return winningLines.some (function (line) {
			// check if all positions were played by the player
			return line.every (function (pos) {
				return (board[pos] === player);
			});
		});
		
	};	 	
	
	// speculative play; returns new board array
	// with the new move played
	var peek = function (board, player, position) {
		var new_board = board.copy();
		new_board[position] = player;		
		return new_board;
	};
		
	// return array of positions player can play on board
	var validPlays = function (board) {
		var plays = [];
		board.forEach(function (b, i) {
			if (b === NONE) plays.push(i);
		});
		return plays;
	};
		
	// player can win in one play
	var canWin = function (board, player) {
		return validPlays(board).some(function (p) {
			return hasWon(peek(board, player, p), player);
		});
	};

	// score of board for this player, assuming just played
	// minimax not interesting for TTT, so add probabilistic element
	// assume that player selects best move with probability of PROB_GOOD

	// 1 if this player has won or can force a win from here
	// -1 if other player has won or can force a win
	// 0 if drawn (no move possible, and no wins)
	// else weighted min of the scores other player can achieve by playing
		
	// level is useful in debugging; not used otherwise
	
	var score = function (board, player, level) {
		
		// if player has already won, return 1
		if (hasWon(board, player)) return 1;
		// if other player can win in one step, return -1
		if (canWin(board, player.other)) return -1;
		
		var plays = validPlays(board);
		// if drawn, return 0
		if (plays.isEmpty()) return 0;
		
		var scores = plays.map(function (p) {
			return -1 * score(peek(board, player.other, p), player.other, level+1);
			});

		var PROB_GOOD = 0.9; // probability of making the right move
		var min_score = scores.reduce(function (a, e) {return (e < a) ? e : a}, 1);
		var non_mins = scores.filter(function (e) {return (e !== min_score);});
		var sum_non_mins = non_mins.reduce(function (a, e) {return a + e;}, 0);
		
		// so score is PROB_GOOD * min + (1 - PROB_GOOD)* average(non_min_scores)
		var count_non_mins = non_mins.length;
		if (count_non_mins == 0) return min_score;
		return (PROB_GOOD * min_score) + (1 - PROB_GOOD) * (sum_non_mins/count_non_mins);
	};
		
    // checks if the game is over
	this.isGameOver = function(player, resultCallback) {		
		if (hasWon(board, player)) {
			this.isGameOver = function () { return true; }
			resultCallback(player, true);
			return true;
		}
		
		var plays = validPlays(board);	
		if (plays.isEmpty()) {
			this.isGameOver = function () { return true; }
			resultCallback(player, false);
			return true;
		}	
		return false;
	};
		
	// returns the player object
	this.getPlayer = function (i) {
		var players = {1: PLAYER_1, 2: PLAYER_2};		
		return players[i];
	};	
    
	// mutate board by playing player in position
	// if the move is valid
	this.play = function (player, position) {
		if (board[position] === NONE) {
			board[position] = player;
			return true;
		}
		return false;
	};
		
	// return best move for player
	this.bestPlayPosition = function (player) {
		var plays = validPlays(board);		
		return plays[
		   	plays.map(function (p) {
				return score(peek(board, player, p), player, 0);
			}).reduce(function(a, e, i, arr) { 
				return (e > arr[a]) ? i : a}, 0)];								
	};
		
}
