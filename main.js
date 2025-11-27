//----CREATE BOARD---- 
const gridType = {
    cols: ["a","b","c","d","e","f","g"],
    rows: ["1","2","3","4","5","6"]
}
const connect4Grid = gridType.rows.map(row => gridType.cols.map(col => undefined))

const grid = document.getElementById("connect4Grid");
const buttons = document.getElementById("connect4Buttons");
const beginButton = document.getElementById("beginConnect4");
const resetButton = document.getElementById("resetConnect4");
const winnerGame = document.getElementById("winnerGame");
const bConnect4 = document.getElementById("beginConnect4");
const connect4Background = document.getElementById("connect4Background")

//----PLAYER VARIABLES----
const player1 = document.getElementById("player_1")
const player2 = document.getElementById("player_2")
let cPlayerTurn = 0;
let winner = null;
let players = []

//----Create The Board----
function setUpGame(){
    //loop and make buttons with coords to switch them for colors when someone clicks on top 
    for (let x = 0 ; x < gridType.rows.length; x++){
        for (let y = 0 ;y < gridType.cols.length; y++){
            const cell = document.createElement(`button`);
            cell.classList = `${connect4Grid[x][y]}`;

            grid.appendChild(cell);
        }
    }

    for (let x=0; x < gridType.cols.length; x++){
        const cell2 = document.createElement("button");
        cell2.innerHTML = `${x + 1}`;
        cell2.onclick = function(){
            playerMove(x);
        }
        buttons.appendChild(cell2)
    }
    beginGame()
    bConnect4.style.pointerEvents = "none";
    document.getElementById("connect4Background").style.display = "grid"
    console.log(players);
}


function beginGame(){
    let firstPlayer = player1.value
    let secondPlayer = player2.value
    beginButton.style.display = "none";

    players = [firstPlayer,secondPlayer];
}

//----Reset Board----
function resetConnect4Grid() {
    for (let row = 0; row < gridType.rows.length; row++) {
        for (let col = 0; col < gridType.cols.length; col++) {
            connect4Grid[row][col] = undefined;
        }
    }
}



//----Game Mechanics----

function playerMove(column) {
    const symbol = (cPlayerTurn === 0) ? "X" : "O";

    // Place symbol in lowest empty row
    let placedRow;
    for (let row = connect4Grid.length - 1; row >= 0; row--) {
        if (!connect4Grid[row][column]) {
            connect4Grid[row][column] = symbol;
            updateSquareColor();
            placedRow = row
            console.log(connect4Grid);
            break;
        }
    }

    // Check situations
    let vertical = verticalConnect4(column);
    let horizontal = horizontalConnect4(placedRow);
    let diagonal = diagonalConnect4();
    let freeSpace = checkAvailSquare();

    // Switch player turn
    cPlayerTurn = (cPlayerTurn === 0) ? 1 : 0;

    // Alert if there’s a winner
    if (vertical == "X" || horizontal === "X" || diagonal === "X") {
        winnerGame.innerHTML = `${players[0]} wins!`;
        winnerGame.style.display = "grid";
        resetButton.style.display = "grid";
    }else if(vertical == "O" || horizontal === "O" || diagonal === "O"){
        winnerGame.innerHTML =  `${players[1]} wins!`;
        winnerGame.style.display = "grid";
        resetButton.style.display = "grid";
    }else if(freeSpace === 0){
        winnerGame.innerHTML =  `No one wins :(`;
        winnerGame.style.display = "grid";
        resetButton.style.display = "grid";
    }
}

//----Game Calculations----

function verticalConnect4(column) {
    let counter = 0;
    let lastSymbol = null;

    for (let row = connect4Grid.length - 1; row >= 0; row--) {
        const cell = connect4Grid[row][column];

        if (cell && cell === lastSymbol) {
            counter++;
            if (counter === 4) {
                return lastSymbol; // winner found
            }
        } else {
            lastSymbol = cell;
            counter = cell ? 1 : 0;
        }
    }
    return null;
}


function horizontalConnect4(row) {
    let counter = 0;
    let lastSymbol = null;

    for (let col = 0; col < connect4Grid[0].length; col++) {
        const cell = connect4Grid[row][col];

        if (cell && cell === lastSymbol) {
            counter++;
            if (counter === 4) return lastSymbol;
        } else {
            lastSymbol = cell;
            counter = cell ? 1 : 0;
        }
    }

    return null;
}


function diagonalConnect4() {
    const rows = connect4Grid.length;
    const cols = connect4Grid[0].length;

    // "\" diagonals (top-left → bottom-right)
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= cols - 4; col++) {
            const symbol = connect4Grid[row][col];
            if (symbol &&
                symbol === connect4Grid[row + 1][col + 1] &&
                symbol === connect4Grid[row + 2][col + 2] &&
                symbol === connect4Grid[row + 3][col + 3]) {
                return symbol;
            }
        }
    }

    // "/" diagonals (bottom-left → top-right)
    for (let row = 3; row < rows; row++) {
        for (let col = 0; col <= cols - 4; col++) {
            const symbol = connect4Grid[row][col];
            if (symbol &&
                symbol === connect4Grid[row - 1][col + 1] &&
                symbol === connect4Grid[row - 2][col + 2] &&
                symbol === connect4Grid[row - 3][col + 3]) {
                return symbol;
            }
        }
    }

    return null;
}


function checkAvailSquare(){

    let remainingTiles = 0;

    for (let x = 0 ; x < gridType.rows.length; x++){
        for (let y = 0 ;y < gridType.cols.length; y++){
            if (connect4Grid[x][y] === undefined){
                remainingTiles++
            }
        }
    }

    return remainingTiles;
}

//----Game Visuals----

function updateSquareColor(){
    const gridButtons = grid.querySelectorAll("button");
    const rows = connect4Grid.length;
    const cols = connect4Grid[0].length;

    for (let row = 0; row < rows; row++){
        for (let col = 0; col < cols; col++){
            const index = row * cols + col; //Calculate button index position
            const cellButton = gridButtons[index];


            if (connect4Grid[row][col] === "X"){
                cellButton.style.backgroundColor = "Red";
            }else if(connect4Grid[row][col] === "O"){
                cellButton.style.backgroundColor = "Yellow"
            }else{
                cellButton.style.backgroundColor = "";
            }
        }
    }
}


//Make-function the removes the buttons after someone wins or if no more spaces are-left
//the array

function resetGame(){
    resetConnect4Grid();

    players = [];
    winnerGame.style.display = "none";
    winnerGame.innerHTML = "";
    resetButton.style.display = "none";
    beginButton.style.display = "grid";
    beginButton.style.pointerEvents = "auto";
    player1.value = player2.value =  ""
    clearBoard();
}

function clearBoard(){
    connect4Background.style.display = "none";
    grid.replaceChildren();
    buttons.replaceChildren();
}



//Quality of life


