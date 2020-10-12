import Game from "./engine/game.js";

var game = new Game(4);


function handleRestartButtonPress() {
    $('#notify-container').empty();
    game = new Game(4);
    drawGame();
    document.onkeydown = function (keyPressed) {
        switch (keyPressed.key) {
            case 'ArrowUp':
                game.move('up');
                drawGame();
                break;
            case 'w':
                game.move('up');
                drawGame();
                break;
            case 'ArrowDown':
                game.move('down');
                drawGame();
                break;
            case 's':
                game.move('down');
                drawGame();
                break;
            case 'ArrowLeft':
                game.move('left');
                drawGame();
                break;
            case 'a':
                game.move('left');
                drawGame();
                break;
            case 'ArrowRight':
                game.move('right');
                drawGame();
                break;
            case 'd':
                game.move('right');
                drawGame();
        }
    };
}

function handleGameWon() {
    $('#notify-container').empty();
    $('#notify-container').append("<div class='notify' id='won-game-notify'>Congratulations, you won! You have reached 2048. Keep Playing or Start Another Game</div>");
}

function handleGameLost() {
    $('#notify-container').empty();
    $('#notify-container').append("<div class='notify' id='lost-game-notify'>Game over. Restart and try Again!</div>");
}

function findBckg(tile) {
    if(tile === 0) {
        return '#FFF';
    } else if(tile === 2) {
        return '#ECEAEA';
    } else if(tile === 4) {
        return '#DEDCF9';
    } else if(tile === 8) {
        return '#9C96ED';
    } else if(tile === 16) {
        return '#2F23D1';
    } else if(tile === 32) {
        return '#06D6A0';
    } else if (tile ===64) {
        return '#4CFACC';
    } else if (tile ===128) {
        return '#7EF32B';
    } else if (tile ===256) {
        return '#F962A6';
    } else if (tile ===512) {
        return '#C81D25';
    } else if (tile ===1024) {
        return '#E4572E';
    } else {
        return '#FAF33E';
    }
}

function drawGame() {
    $('#game').empty();
    var board = game.getGameState().board;
    var copy = board.toString();
    if (board.includes(2048)) {
        handleGameWon();
    }
    var rows = [];
    while (board.length > 0) {
        rows.push(board.splice(0, 4));
    }
    rows.forEach(row => {
        var tile0 = row[0];
        var bckg0 = findBckg(row[0]);
        if(row[0] === 0) {
            tile0 = '';
        }
        var tile1 = row[1];
        var bckg1 = findBckg(row[1]);
        if(row[1] === 0) {
            tile1 = '';
        }
        var tile2 = row[2];
        var bckg2 = findBckg(row[2]);
        if(row[2] === 0) {
            tile2 = '';
        }
        var tile3 = row[3];
        var bckg3 = findBckg(row[3]);
        if(row[3] === 0) {
            tile3 = '';
        }
        $('#game').append("<div onselectstart='return false' class='row'><div class='tile' style='background-color: "+bckg0+";'>"+tile0+"</div><div class='tile' style='background-color: "+bckg1+";'>"+tile1+"</div><div class='tile' style='background-color: "+bckg2+";'>"+tile2+"</div><div class='tile' style='background-color: "+bckg3+";'>"+tile3+"</div></div>")
    });
    $('#score-game').empty();
    $('#score-game').append("Score: " + game.getGameState().score);
    if(game.getGameState().over) {
        handleGameLost();
    }
    game.board = copy.split(',').map(Number);
}

$(document).ready(function() {
    handleRestartButtonPress();
    $("#restart-game-btn").click(handleRestartButtonPress);
});