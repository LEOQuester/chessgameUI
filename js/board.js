const urlParams = new URLSearchParams(window.location.search);


console.log(urlParams)
// Access properties in the parsed JSON object
// Assign values to variables
const id = (urlParams.get('id') === 'null') ? null : urlParams.get('id');
const token = (urlParams.get('token') === 'null') ? null : urlParams.get('token');
const elo = (urlParams.get('elo') === 'null') ? null : urlParams.get('elo');
const move = (urlParams.get('move') === 'null') ? null : urlParams.get('move');
const mode = (urlParams.get('mode') === 'null') ? null : urlParams.get('mode');
const serial = (urlParams.get('robot') === 'null') ? null : urlParams.get('robot');


//present the game data
document.getElementById("serial").innerHTML = `:  ${serial}`;
document.getElementById("gameId").innerHTML = `:  ${id}`;
document.getElementById("elo").innerHTML = `:  ${elo}`;


// Use variables as neededs
console.log(id);
console.log(token);
console.log(elo);

//check for the game mode and adjut the board draggable status
console.log(mode);
var draggableStatus;
if (mode === "play"){
    draggableStatus = true;
    var board = null
    var game = new Chess()
}else{
    setInterval(function() {
        getFen();
    }, 5000);
}
const navigationEntries = performance.getEntriesByType("navigation");

if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
  // Page is reloaded
  alert('Page has been reloaded and your game data lost');
  window.location.href = `getGame.html`
} else {
  // Page is not reloaded or the type is unknown
  console.log('Page is not reloaded');
}


var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
  $('#board2 .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#board2 .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    greySquare(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
  }
  
function onMouseoutSquare (square, piece) {
removeGreySquares()
}

if(move != null){
    console.log("hre here")
    console.log(move)
    var config = {
        orientation : 'black',
        draggable: draggableStatus,
        dropOffBoard: 'snapback', // this is the default
        position: 'start',
        onDrop: onDrop,
        onDragStart: onDragStart,
        onSnapEnd: onSnapEnd,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare
    }
    var board = Chessboard('board2', config)
    board.move(convertToStandardNotation(move))
    if (draggableStatus == true){
        game.move({
            from: move.substring(0, 2),
            to: move.substring(2, 4),
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
          })
    }
}else{
    console.log("landed here")
    var config = {
        orientation: 'white',
        draggable: draggableStatus,
        dropOffBoard: 'snapback', // this is the default
        position: 'start',
        onDrop: onDrop,
        onDragStart: onDragStart,
        onSnapEnd: onSnapEnd,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare
    }
    var board = Chessboard('board2', config)
    board.move(convertToStandardNotation(move))
}


function getFen() {
    var postData = {
        id: id,
        token: token,
    };

    // Send the POST request using the Fetch API
    fetch('http://localhost:5000/api/games/board', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', typeof data);
        updateBoard(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function updateBoard(newFen){
    console.log("update: "+newFen);
    board.position(newFen);
}


function convertToStandardNotation(move) {
    // Check if the move is in the correct format
    const moveRegex = /^[a-h][1-8][a-h][1-8]$/;
    if (!moveRegex.test(move)) {
        console.error("Invalid move format:", move);
        return null;
    }

    // Split the move into source and destination squares
    const sourceSquare = move.slice(0, 2);
    const destinationSquare = move.slice(2, 4);

    // Construct the standard algebraic notation format
    const standardNotation = `${sourceSquare}-${destinationSquare}`;
    return standardNotation;
}

function onDrop(source, target, piece, newPos, oldPos, orientation) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      })
    
      // illegal move
      if (move === null) return 'snapback'

    console.log('Source: ' + source);
    console.log('Target: ' + target);
    console.log('updated fen: ' + Chessboard.objToFen(newPos))
    var userMove = source + target;
    var postData = {
        id: id,
        token: token,
        sn: null,
        move: userMove
    };

    // Send the POST request using the Fetch API
    fetch('http://localhost:5000/api/games/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data
        console.log('Response from server:', data);
        console.log(data.move);
        if(data.move == "ILLEGAL_MOVE"){
            //undo reverse the userMove
            board.move(reverseMove(userMove));
            alert("Don not perform Illegal Moves!")
        }else{
            board.move(convertToStandardNotation(data.move));
            game.move({
                from: data.move.substring(0, 2),
                to: data.move.substring(2, 4),
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            })
        }
        
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
    }
}

function reverseMove(userMove) {
    // Extract source and target squares
    const source = userMove.slice(0, 2);
    const target = userMove.slice(2, 4);

    // Reverse the move
    const reversedMove = target + '-' + source;

    return reversedMove;
}
// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}
//TODO : save users move and send to backend.. if move is present in response.. then perform both moves
//TODO : if source == target dont send the move
//TODO : present data

//hardcode 4 cases
//TODO : fix casteling of user
//TODO : fix engines Casteling 

//TODO :handle game ending
//TODO : store fen in a cookie each time it updates (id and cookie)

//TODO : promotion always = q || asking from user???
//TODO : validate response object .. check for promotions
//TODO : game not storing players color -- secondary
//TODO : reset button endpoint and show the game leaving
