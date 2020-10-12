export default class Game {
    constructor(n) {
        this.n = n;
        this.score = 0;
        this.won = false;
        this.over = false;
        this.board = [];
        this.setupNewGame();
        this.onMoveCallbacks = [];
        this.onWinCallbacks = [];
        this.onLoseCallbacks = [];
    }

    setupNewGame() {
        this.board = new Array(this.n*this.n);
        for (let index = 0; index < this.board.length; index++) {
            this.board[index] = 0;
        }
        var init1 = Math.floor(Math.random() * this.board.length);
        var init2 = Math.floor(Math.random() * this.board.length);
        while(init1 == init2) {
            var init2 = Math.floor(Math.random() * this.board.length);
        }
        this.board[init1] = this.newTile();
        this.board[init2] = this.newTile();
    }

    loadGame(gameState) {
        this.n = Math.sqrt(gameState.board.length);
        this.score = gameState.score;
        this.won = gameState.won;
        this.over = gameState.over;
        this.board = gameState.board;
    }

    checkIfOver() {
        var board = this.board.toString();
        var over = true;
        this.shiftVertical();
        if(this.moveBoard()['success']) {
            over = false;
        }
        this.board = board.split(',').map(Number);
        this.shiftVertical();
        this.shiftAcross();
        if(this.moveBoard()['success']) {
            over = false;
        }
        this.board = board.split(',').map(Number);
        if(this.moveBoard()['success']) {
            over = false;
        }
        this.board = board.split(',').map(Number);
        this.shiftAcross();
        if(this.moveBoard()['success']) {
            over = false;
        }
        this.board = board.split(',').map(Number);
        this.over = over;
        if(this.over === true) {
            this.onLoseCallbacks.forEach(callback => {
                callback();
            });
        }
    }

    removeZeroes(row) {
        for (let index = 0; index < row.length; index++) {
            if(row[index] == 0) {
                row.splice(index, 1);
                index--;
            }  
        }
        var pad = this.n -  row.length;
        while(pad > 0) {
            row.push(0);
            pad --;
        }
    }

    slideBoard(rows) {
        var success = false;
        var scoreToAdd = 0;
        var copy = rows.toString();
        rows.forEach(row => {
            this.removeZeroes(row);
            for (let index = 0; index < row.length; index++) {
                try {
                    if(row[index] > 0) {
                        if(row[index + 1] == row[index]) {
                            if((2 * row[index]) === 2048) {
                                this.won = true;
                                this.onWinCallbacks.forEach(callback => {
                                    callback();
                                });
                            }
                            scoreToAdd += 2 * row[index];
                            row[index] = 2 * row[index];
                            row[index + 1] = 0;
                            success = true;
                        }
                    }
                } catch (err) {

                } 
            }
            this.removeZeroes(row);
        });
        var success = true;
        if(copy === rows.toString()) {
            success = false;
        }
        return {'rows': rows, 'scoreToAdd': scoreToAdd, 'success': success};
    }

    shiftAcross() {
        var shifted = [];
        while(this.board.length > 0) {
          shifted.push(this.board.splice(0, this.n).reverse());
        }
        this.board = [].concat(...shifted);
    }

    shiftVertical() {
        var shifted = [];
        var ct = 0;
        while(ct < this.n) {
          var index = ct;
          while(index < this.board.length) {
            shifted.push(this.board[index]);
            index += this.n;
          }
          var row = [];
          shifted.push(row);
          ct++;
        }
        this.board = [].concat(...shifted); 
    }

    moveBoard() {
        var success = false;
        var scoreToAdd = 0;
        var rows = [];
        while (this.board.length > 0) {
            rows.push(this.board.splice(0, this.n));
        }
        var result = this.slideBoard(rows);
        scoreToAdd = result['scoreToAdd'];
        this.board = [].concat(...result['rows']);
        if(result['success']) {
            this.addToNewAvailableTile();
            success = true;
        }
        return result;
    }

    move(direction) {
        var result = {};
        if (direction.localeCompare("up") == 0) {
            this.shiftVertical();
            result = this.moveBoard();
            this.shiftVertical();
        }
        else if (direction.localeCompare("down") == 0) {
            this.shiftVertical();
            this.shiftAcross();
            result = this.moveBoard();
            this.shiftAcross();
            this.shiftVertical();
        }
        else if (direction.localeCompare("left") == 0) {
            result = this.moveBoard();
        } else {
            this.shiftAcross();
            result = this.moveBoard();
            this.shiftAcross();
        }
        if(result['scoreToAdd'] > 0) {
            this.score += result['scoreToAdd'];
        }
        this.checkIfOver();
        this.onMoveCallbacks.forEach(callback => {
            callback();
        });
    }

    toString() {
        var returned = "";
        for (let index = 0; index < this.board.length; index++) {
            if(index % this.n == 0) {
                returned += '\n';
            }
            returned += "[" + this.board[index] + "] ";
        }
        return returned;
    }

    onMove(callback) {
        this.onMoveCallbacks.push(callback);
    }

    onWin(callback) {
        this.onWinCallbacks.push(callback);
    }

    onLose(callback) {
        this.onLoseCallbacks.push(callback);
    }

    getGameState() {
        var gameState = {};
        gameState.board = this.board;
        gameState.score = this.score;
        gameState.won = this.won;
        gameState.over = this.over;
        return gameState;
    }

    isUnavailable() {
        for (let index = 0; this.board < this.board.length; index++) {
            if(this.board[index] == 0) {
                return true;
            }
        }
        return false;
    }

    addToNewAvailableTile() {
        if(this.isUnavailable) {
            var init1 = Math.floor(Math.random() * this.board.length);
            if (this.board[init1] === 0) {
                this.board[init1] = this.newTile();
            } else {
                this.addToNewAvailableTile();
            }
        }
    }

    newTile() {
        var random = Math.random();
        if(random <= 0.9) {
            return 2;
        }
        return 4;
    }
}