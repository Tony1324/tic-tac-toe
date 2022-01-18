let board = Array(3).fill(0).map(() => Array(3).fill("square-empty"));

let step = 0;
let hasWon = false

let is2player = false
let playerSelect = document.querySelector("#player-select")

playerSelect.addEventListener("change", () => {
    console.log(playerSelect.value);
    if (playerSelect.value == "2") {
        is2player = true
    } else {
        is2player = false
    }
})

function makePlayerMove(x, y) {
    if (step % 2 == 0 || is2player) {
        makeMove(x, y)
    }
}

function makeMove(x, y) {
    if ((board[x][y] == "square-empty" || board[x][y] == "circle-empty") && !hasWon) {
        board[x][y] = step % 2 == 0 ? "square-filled" : "circle-filled";
        step++;

        for (let i in board) {
            for (let j in board[i]) {
                if (board[i][j] == "square-empty" || board[i][j] == "circle-empty") {
                    board[i][j] = step % 2 == 0 ? "square-empty" : "circle-empty";
                }
            }
        }

        updateBoard();

        let win = checkWin(board)
        if (win) {
            hasWon = true
            for (let i in board) {
                for (let j in board[i]) {
                    let isWinner = false
                    for (let point of win) {
                        if (point.x == i && point.y == j) {
                            isWinner = true
                        }
                    }
                    if (!isWinner) {
                        if (board[i][j] == "square-filled") board[i][j] = "square-empty"

                        if (board[i][j] == "circle-filled") board[i][j] = "circle-empty"
                    }
                }
            }
            let point = win[0]
            let isX = board[point.x][point.y] == "square-filled"
            updateTitle(isX ? "X WINS" : "O WINS", isX)

            //moved this inside the check win section, so it wouldn't update every move
            setTimeout(() => {
                updateBoard()
            }, 1000)

        } else if (step >= 9) {
            //added conditional to check for draws
            updateTitle("DRAW", false)
        } else {
            if (!is2player && step % 2 == 1) {
                setTimeout(() => {
                    let move = MiniMax(board, step).move
                    makeMove(move.x, move.y)
                }, 500)
            }
            updateTitle(step % 2 == 0 ? "X'S TURN" : "O'S TURN", step % 2 == 0)
        }

    }
}

function checkWin(board) {
    let lines = [
        [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
        [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
        [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
        [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
        [{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }],
    ]
    for (let line of lines) {
        let [a, b, c] = line
        if (board[a.x][a.y] == board[b.x][b.y] &&
            board[a.x][a.y] == board[c.x][c.y] &&
            board[a.x][a.y] != "square-empty" &&
            board[a.x][a.y] != "circle-empty") {

            return line
        }
    }
}

function getWinner(board) {
    let win = checkWin(board)
    if (win) {
        let point = win[0]
        let isX = board[point.x][point.y] == "square-filled"
        return isX ? 1 : -1
    }
}

function copyBoard(board) {
    return board.map(row => row.slice())
}

function MiniMax(board, step) {

    let score = getWinner(board)
    if (score) return { score }
    if (step == 9) return { score: 0 }

    let bestScore = step % 2 == 0 ? -Infinity : Infinity
    let bestMove = {}
    for (let i in board) {
        for (let j in board[i]) {
            if (board[i][j] == "square-empty" || board[i][j] == "circle-empty") {
                let copiedBoard = copyBoard(board)
                copiedBoard[i][j] = step % 2 == 0 ? "square-filled" : "circle-filled"
                let result = MiniMax(copiedBoard, step + 1)
                let score = result.score
                if (step % 2 == 0) {
                    if (score > bestScore) {
                        bestScore = score
                        bestMove = { x: i, y: j }
                    }
                } else {
                    if (score < bestScore) {
                        bestScore = score
                        bestMove = { x: i, y: j }
                    }
                }
            }
        }
    }

    return { score: bestScore, move: bestMove }

}

function updateBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let element = document.getElementById(i + '-' + j);
            switch (board[i][j]) {

                case "square-empty":
                    element.className = "box square"
                    break;
                case "circle-empty":
                    element.className = "box circle"
                    break;
                case "square-filled":
                    element.className = 'box square filled';
                    break;
                case "circle-filled":
                    element.className = 'box circle filled';
                    break;
            }
        }
    }
}

//here is a bit more change, essentially there is a graphics glitch were if you click too fast (quicker than the settimeout completes)
//it will cause the title to snap to the second one with no transition
//solution is to make a queue with an array, and ensure that the titles animate one after the other
//this will technically cause it to lag behind, but unless you are playing way faster than possible, it should be fine

let titles = []


//new function that pushes a title to the queue
function updateTitle(name, isX) {
    let length = titles.length
    titles.push({ name: name, isX: isX })

    //if the array was empty before we added a title, we need to call the function again


    if (length == 0) {
        updateIndividualTitle()
    }
}

//og function got renamed to updateIndividualTitle
function updateIndividualTitle() {
    //get first element in array
    let title = titles[0]


    let status1 = document.querySelector("#status-1")
    let status2 = document.querySelector("#status-2")
    //title has been renamed to title.name, isX is renamed to title.isX
    status2.innerHTML = title.name
    status2.className = title.isX ? "x" : "o"
    status1.style.transition = "left 0.5s ease"
    status2.style.transition = "left 0.5s ease"
    status1.style.left = "-50%"
    status2.style.left = "50%"
    setTimeout(() => {
        status1.style.transition = ""
        status2.style.transition = ""
        status1.style.left = "50%"
        status2.style.left = "200%"
        //same here
        status1.innerHTML = title.name
        status1.className = title.isX ? "x" : "o"

        //remove first element of title after we're done
        titles.shift()

        //check if there is more items in the array, if yes, call it again
        if (titles.length > 0) {
            //request animation frame basically just waits one frame before calling the function again
            //this way the resetting part of the funciton in the setTimeout is not called the same frame as when the function is called again
            //if you remove the request animation frame, the transitions will not work properly
            requestAnimationFrame(updateIndividualTitle)
        }
    }, 500)


}

function restart() {
    board = Array(3).fill(0).map(() => Array(3).fill("square-empty"));
    step = 0;
    hasWon = false;
    updateTitle("X'S TURN", true)
    updateBoard();
}




