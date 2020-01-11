var myTurn = false;
var alteredCards = [];
var waiting = 0;
var tempStart = 0;

function waitTurn() {
    const url = 'http://dijkstra.cs.ttu.ee/~envomp/cgi-bin/server.py?multiplayer=' + document.getElementById("gameId").innerHTML;
    console.log(url);
    var response = getResponse(url);
    if ("playerId" in response && response['playerId'] !== document.getElementById("playerId").innerHTML && response['playerId'].length < 2) {
        var guesses = board.guesses;
        response["cards"].forEach(function (card) {
            if (document.getElementById(card)) {
                board.showCard(document.getElementById(card));
                board.flipCard(document.getElementById(card));
                board.lastCard = document.getElementById(card);
                if (board.cards === 0) {
                    requestMultiplayerEnd.call(board);
                }
            }
        });
        board.guesses = guesses;
        board.lastCard = null;
        alteredCards = [];
        myTurn = true;
        var addition = Date.now() - tempStart;
        tempStart = 0;
        waiting += addition;
        return;
    }
    setTimeout(waitTurn, 500);
}


function requestEnd() {
    var timeElapsed = (Math.round((Date.now() - this.time) / 10) / 100).toString();
    var score = (1000 - timeElapsed - this.guesses).toString();
    var person = prompt("Your score was: " + score + "\nTime elapsed: " + timeElapsed + "\nWrong guesses: " + this.guesses + "\n\nPlease enter your name", "Harry Plopeller");

    window.location.replace("http://dijkstra.cs.ttu.ee/~envomp/cgi-bin/scoreboard.py?score=" + person + "," + score + "," + timeElapsed + "," + Date.now() + "," + document.getElementById("size").value + "," + document.getElementById("gameRule").value);
}

function requestMultiplayerEnd() {
    var DuoTimeElapsed = (Math.round((Date.now() - this.time - waiting) / 10) / 100).toString();
    var DuoScore = (1000 - DuoTimeElapsed - this.guesses).toString();
    var DuoPerson = prompt("Your score was: " + DuoScore + "\nTime elapsed: " + DuoTimeElapsed + "\nWrong guesses: " + this.guesses + "\n\nPlease enter your name", "Harry Plopeller");

    window.location.replace("http://dijkstra.cs.ttu.ee/~envomp/cgi-bin/scoreboard.py?multiplayerResult=" + document.getElementById("gameId").innerHTML + "&multiplayerScore=" + DuoPerson + "," + DuoScore + "," + DuoTimeElapsed + "," + Date.now() + "," + this.size + "," + this.rule);
}

class Board {
    constructor(size, rule) {
        this.cards = size;
        this.size = size;
        this.lastCard = null;
        this.time = Date.now();
        this.guesses = 0;
        this.rule = rule;
    }

    cardOnHit(card) {
        if (card === this.lastCard || !myTurn) {
            return
        }

        this.showCard(card);

        alteredCards.push(card.id);

        if (this.lastCard == null) {
            this.lastCard = card
        } else {
            if (this.flipCard(card)) {
                if (document.getElementById("playerId")) {

                    if (this.cards === 0) {

                        const url = 'http://dijkstra.cs.ttu.ee/~envomp/cgi-bin/server.py?multiplayer=' + document.getElementById("gameId").innerHTML + '&cards=' + alteredCards + "&player=" + document.getElementById("playerId").innerHTML;
                        console.log(url);
                        getResponse(url);

                        requestMultiplayerEnd.call(this);

                    }

                } else { // single player score
                    if (this.cards === 0) {
                        // var newRow = document.getElementById('score').insertRow();
                        // var newNameCell = newRow.insertCell(0);
                        // var newScoreCell = newRow.insertCell(1);
                        // var newTimeCell = newRow.insertCell(2);
                        requestEnd.call(this);
                        refresh(0);
                    }
                }
                return;
            }

            if (document.getElementById("gameId")) {
                const url = 'http://dijkstra.cs.ttu.ee/~envomp/cgi-bin/server.py?multiplayer=' + document.getElementById("gameId").innerHTML + '&cards=' + alteredCards + "&player=" + document.getElementById("playerId").innerHTML;
                console.log(url);
                getResponse(url);
                myTurn = false;
                tempStart = Date.now();
                setTimeout(waitTurn, 500);
            }
        }
    }

    showCard(card) {
        var xOffset = 79 * parseInt(card.id.charAt(0), 16);
        var yOffset = 123 * parseInt(card.id.charAt(1), 16);

        card.setAttribute("src", "http://dijkstra.cs.ttu.ee/~envomp/prax2/cards.svg#svgView(viewBox(" + xOffset + ", " + yOffset + ", 79, 123))");
    }

    flipCard(card) {
        if (card === this.lastCard || !this.lastCard) {
            return
        }
        const lastCard = this.lastCard;
        this.lastCard = null;
        if (this.rule === 1) {
            if (card.id.charAt(0) === lastCard.id.charAt(0)) {
                this.pop(lastCard, card);
                return true;
            } else {
                this.turn(card, lastCard);
            }
        } else {
            if (card.id.charAt(0) === lastCard.id.charAt(0) && Math.abs(parseInt(card.id.charAt(1), 10) - parseInt(lastCard.id.charAt(1), 10)) !== 0) {
                this.pop(lastCard, card);
                return true;
            } else {
                this.turn(card, lastCard);
            }
        }
        return false;
    }

    turn(card, lastCard) {
        setTimeout(function () {
            card.setAttribute("src", "http://dijkstra.cs.ttu.ee/~envomp/prax2/cards.svg#svgView(viewBox(" + 158 + ", " + 492 + ", 79, 123))");
            lastCard.setAttribute("src", "http://dijkstra.cs.ttu.ee/~envomp/prax2/cards.svg#svgView(viewBox(" + 158 + ", " + 492 + ", 79, 123))");
        }, 1500);
        this.guesses++;
    }

    pop(lastCard, card) {
        this.cards -= 2;
        setTimeout(function () {
            lastCard.parentNode.removeChild(lastCard);
            card.parentNode.removeChild(card);
        }, 1500);
    }
}

function getResponse(url) {
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return JSON.parse(req.responseText.split("'").join('"'));
}

var board;

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function startGame() {
    var players = document.getElementById("players").value;

    if (players === "2") {
        var person = prompt("Enter a host secret to join his game. Otherwise leave blank to become the host.", "");
        if (person === "") {
            person = makeid(5);
        }
        window.location.replace("http://dijkstra.cs.ttu.ee/~envomp/cgi-bin/scoreboard.py?multiplayer=" + person + "&size=" + document.getElementById("size").value + "&rule=" + document.getElementById("gameRule").value);
        return;
    }

    var e = document.getElementById("size");
    var boardSize = parseInt(e.options[e.selectedIndex].value, 10);
    const o = document.getElementById("gameRule");
    var rule = o.options[o.selectedIndex].value;

    addTable(boardSize, rule);

}

function addTable(boardSize, rule) {

    var row;
    var column;
    var allCards;

    if (boardSize === 6) {
        allCards = ['01', '02', '11', '12', '21', '22'];
        column = 6;
        row = 1;
    } else if (boardSize === 16) {
        allCards = ['01', '02', '11', '12', '21', '22', '31', '32', '41', '42', '51', '52', '61', '62', '71', '72'];
        column = 4;
        row = 4;
    } else if (boardSize === 26) {
        allCards = ['01', '02', '11', '12', '21', '22', '31', '32', '41', '42', '51', '52', '61', '62', '71', '72', '81', '82', '91', '92', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
        column = 13;
        row = 2;
    } else {
        allCards = ['00', '01', '02', '03', '10', '11', '12', '13', '20', '21', '22', '23', '30', '31', '32', '33', '40', '41', '42', '43', '50', '51', '52', '53', '60', '61', '62', '63', '70', '71', '72', '73', '80', '81', '82', '83', '90', '91', '92', '93', 'a0', 'a1', 'a2', 'a3', 'b0', 'b1', 'b2', 'b3', 'c0', 'c1', 'c2', 'c3'];
        column = 13;
        row = 4;
    }

    board = new Board(boardSize, rule);
    var shuffledCards = shuffle(allCards);

    document.getElementById("myDynamicTable").innerHTML = "";
    var myTableDiv = document.getElementById("myDynamicTable");
    var table = document.createElement('TABLE');
    table.setAttribute("align", "center");
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 0; i < row; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var j = 0; j < column; j++) {
            var td = document.createElement('TD');
            var card = document.createElement("INPUT");
            card.id = shuffledCards[j + column * i];
            card.setAttribute("type", "image");
            card.setAttribute("src", "http://dijkstra.cs.ttu.ee/~envomp/prax2/cards.svg#svgView(viewBox(" + 158 + ", " + 492 + ", 79, 123))");
            card.setAttribute("style", "width:79px;height:123px;");
            card.addEventListener('click', function () {
                board.cardOnHit(this)
            }, false);
            td.appendChild(card);
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);

    if (document.getElementById("playerId")) {
        if (document.getElementById("playerId").innerHTML === "1") {
            console.log('here we go');
            myTurn = false;
            tempStart = Date.now();
            waitTurn();
        }
        if (document.getElementById("playerId").innerHTML === "2") {
            myTurn = true
        }

    } else {
        myTurn = true;
    }

    document.getElementById("gameButton").remove();

}


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("score");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function changeVisibility() {
    if ($('#gameRule :selected').attr('label') === "same suit or colour") {
        document.getElementById("52s").style.display = 'block'
    } else {
        document.getElementById("52s").style.display = 'none'
    }
}

function refresh(n) {
    sortTable(n);

    var chart = Highcharts.chart('container', {
        data: {
            table: 'score'
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Graafik'
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Units'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' ' + this.point.name.toLowerCase();
            }
        }
    });

}