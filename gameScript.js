let board = ['', '', '', '', '', '', '', '', ''];
let active = true;
let human = 'X'; 
let ai = 'O';
let currentPlayer = human;
let firstMove = true;
let scores = {'X':-1, 'O':1, 'tie':0};

const cells = document.querySelectorAll('.cell');
const messageDiv = document.getElementById('message');

function checkWinner(){
    const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const combo of winningCombos){
        //try all winning combination and check if either player has attained it
        const [a, b, c] = combo;
        if (board[a] === board[b] && board[a] === board[c] && board[a] != ''){
            return board[a]
        }
    }
    if (board.includes('')){
        //open spots remaining, keep playing
        return null
    }
    else{ 
        //no open spots remaining, tied end of game
        return 'tie'
    }
}

function minimax(board, depth, isMaximizing){
    let result = checkWinner(); 
    if (result !== null){
        //base case: full-board leaf
        return scores[result]
    }

    if (isMaximizing){
        //ai turn, maximizing score
        let best = -Infinity;
        for (let i=0; i<9; i++){
            if (board[i] == ''){
                board[i] = ai;
                let score = minimax(board, depth+1, false); 
                board[i] = ''; 
                best = Math.max(score, best);
            }
        }
        return best
    }
    else{
        //human turn, minimizing score
        let best = Infinity; 
        for (let i=0; i<9; i++){
            if (board[i] == ''){
                board[i] = human; 
                let score = minimax(board, depth+1, true)
                board[i] = ''; 
                best = Math.min(score, best);
            }
        }
        return best;
    }
}

function bestMove(){
    let best = -Infinity; 
    let move; 
    for (let i=0; i<9; i++){
        if (board[i] === ''){
            board[i] = ai;
            let score = minimax(board, 0, false); 
            board[i] = ''; 
            if (score > best){
                best = score; 
                move = i; 
            }
        }
    }
    board[move] = ai; 
    cells[move].textContent = ai; 
    currentPlayer = human;
}

function handleClick(event){
    const cellIndex = Array.from(cells).indexOf(event.target); 
    if (firstMove){ 
        firstMove = false; 
        messageDiv.textContent = '';
    }
    if (board[cellIndex] === '' && active && currentPlayer === human){
        board[cellIndex] = human; 
        event.target.textContent = human; 
        const winner = checkWinner(); 
        if (winner){ 
            endGame(winner); 
        }
        else{ 
            currentPlayer = ai; 
            setTimeout(() => {bestMove(); const winner = checkWinner(); if (winner){endGame(winner);}}, 500);
        }
    }
}

function endGame(winner){
    active = false; 
    if (winner === 'tie'){
        messageDiv.textContent = "It's a tie!";
    }
    else if (winner == human){
        messageDiv.textContent = "YOU WIN!";
    }
    else{ 
        messageDiv.textContent = "You lost!";
    }
}

function resetGame(){ 
    currentPlayer = human;
    board = ['', '', '', '', '', '', '', '', ''];
    active = true;
    firstMove = true;
    cells.forEach(cell => (cell.textContent = ''));
    messageDiv.textContent = "Game Reset.";
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
document.getElementById('reset').addEventListener('click', resetGame);