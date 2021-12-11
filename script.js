let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

let step = 0;

function makeMove(x, y) {
    if (board[x][y] == 0) {
        board[x][y] = step % 2 + 1;
        step++;
        updateBoard();
    }

    console.log(board);
}

function updateBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let element = document.getElementById(i + '-' + j);
            switch (board[i][j]) {
                case 0:
                    element.className = 'box ' + (step % 2 == 0 ? 'square' : 'circle');
                    break;
                case 1:
                    element.className = 'box square filled';
                    break;
                case 2:
                    element.className = 'box circle filled';
                    break;
            }
        }
    }
}
