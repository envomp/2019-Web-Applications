var turns = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
var enemyTurn = "";
var turn = "";
var host = false;
var gameTurn = "";
var output = document.querySelector("#output");

// var startTurn = prompt("Choose Your Move", "Type X or O").toUpperCase();

function playerTurn(turn, id) {
    console.log(turn);
    console.log(gameTurn);
    if (turn !== "" && turn === gameTurn) {

        var spotTaken = $("#" + id).text();
        if (spotTaken === "#") {
            host = true;

            if (gameTurn === "X") {
                gameTurn = "O";
            } else {
                gameTurn = "X";
            }
            console.log(gameTurn);
            console.log();
            turns[id] = turn;
            $("#" + id).text(turn);

            socket.emit("turn", {
                turn: turn,
                id: id
            });

            console.log(turns);
            winCondition(turns, turn);

        }

    } else {
        if (turn === "") {
            output.innerHTML += "<p><strong>" + "game master" + ":</strong>" + "You need to start the game first, buddy!" + "</p>";
        } else {
            output.innerHTML += "<p><strong>" + "game master" + ":</strong>" + "Its not your turn.. Yet." + "</p>";
        }
    }
}

function playerTurnAuto(turn, id) {

    turns[id] = turn;
    $("#" + id).text(turn);

    if (gameTurn === "X") {
        gameTurn = "O";
    } else {
        gameTurn = "X";
    }
    winCondition(turns, turn);


}

function winCondition(trackMoves, currentMove) {
    if (trackMoves[0] === currentMove && trackMoves[1] === currentMove && trackMoves[2] === currentMove || trackMoves[2] === currentMove && trackMoves[4] === currentMove && trackMoves[6] === currentMove || trackMoves[0] === currentMove && trackMoves[3] === currentMove && trackMoves[6] === currentMove || trackMoves[0] === currentMove && trackMoves[4] === currentMove && trackMoves[8] === currentMove || trackMoves[1] === currentMove && trackMoves[4] === currentMove && trackMoves[7] === currentMove || trackMoves[2] === currentMove && trackMoves[5] === currentMove && trackMoves[8] === currentMove || trackMoves[2] === currentMove && trackMoves[5] === currentMove && trackMoves[8] === currentMove || trackMoves[3] === currentMove && trackMoves[4] === currentMove && trackMoves[5] === currentMove || trackMoves[6] === currentMove && trackMoves[7] === currentMove && trackMoves[8] === currentMove) {
        alert("Player " + currentMove + " wins!");
        hardReset();
    } else if (!(trackMoves.includes("#"))) {
        alert("It is a Draw!");
        hardReset();
    }﻿
}

$(".tic").click(function () {
    var slot = $(this).attr('id');
    playerTurn(turn, slot);
});


function hardReset() {
    turns = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
    $(".tic").text("#");


    enemyTurn = "";
    turn = "X";

    $("#game-message").html("Feel free to start a new game by pressing start.");

    gameTurn = "";
    output.innerHTML += "<p><strong>" + "game master" + ":</strong>" + "GG!" + "</p>";
}


function reset() {
    turns = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
    $(".tic").text("#");

    if (host) {
        host = false;
        enemyTurn = "O";
        turn = "X";
        $("#game-message").html("Player " + turn + " gets to start!");
    } else {
        enemyTurn = "X";
        turn = "O";
        $("#game-message").html("Player " + enemyTurn + " gets to start!");
    }

    gameTurn = "X";
    output.innerHTML += "<p><strong>" + "game master" + ":</strong>" + "You are playing as " + turn + "!" + "</p>";
}

$("#start").click(function () {
    host = true;
    socket.emit("start", host);
});


//Create  connection
var socket = io.connect("http://dijkstra.cs.ttu.ee:7538");


//Listeners
socket.on("start", function (data) {
    reset();
});

socket.on("turn", function (data) {
    if (!host) {
        playerTurnAuto(data.turn, data.id);
    }
    host = false;
});
