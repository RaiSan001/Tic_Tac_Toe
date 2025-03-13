class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameType = null;
        this.gameActive = true;

        this.initEventListeners();
        this.renderHomeScreen();
    }

    initEventListeners() {
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('[data-mode]')) {
                this.startGame(e.target.dataset.mode);
            }

            if (e.target.classList.contains('home-btn')) {
                this.resetGame();
            }

            if (e.target.classList.contains('cell') && this.gameActive) {
                const index = parseInt(e.target.dataset.index);
                this.handleMove(index);
            }
        });
    }

    startGame(type) {
        this.gameType = type;
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        this.resetBoard();

        if (this.gameType === 'computer' && this.currentPlayer === 'O') {
            this.makeComputerMove();
        }
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        document.getElementById('home-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        this.updateStatus();
    }

    resetBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        this.board.forEach((_, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = index;
            boardElement.appendChild(cell);
        });
    }

    handleMove(index) {
        if (!this.board[index] && this.gameActive) {
            this.gameActive = false;
            this.board[index] = this.currentPlayer;
            this.updateBoard();


             if (this.checkWin()) {
                this.gameActive = false;
                this.updateStatus(`${this.currentPlayer} Wins!`);
                return;
            }

             if (this.checkDraw()) {
                this.gameActive = false;
                this.updateStatus("It's a Draw!");
                return;
            }

            this.switchPlayer();

             //preventing fast clicks
            setTimeout(() => {
            this.gameActive = true;
        }, 500);

            if (this.gameType === 'computer' && this.currentPlayer === 'O') {
                this.makeComputerMove();
            }
        }
    }

    makeComputerMove() {
        let bestScore = -Infinity;
        let bestMove;

        // Minimax algorithm
        this.board.forEach((cell, index) => {
            if (!cell) {
                this.board[index] = 'O';
                let score = this.minimax(false);
                this.board[index] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = index;
                }
            }
        });

        setTimeout(() => this.handleMove(bestMove), 500);
    }

    minimax(isMaximizing) {
        if (this.checkWin('O')) return 1;
        if (this.checkWin('X')) return -1;
        if (this.checkDraw()) return 0;

        let bestScore = isMaximizing ? -Infinity : Infinity;
        const player = isMaximizing ? 'O' : 'X';

        this.board.forEach((cell, index) => {
            if (!cell) {
                this.board[index] = player;
                const score = this.minimax(!isMaximizing);
                this.board[index] = null;

                bestScore = isMaximizing ?
                    Math.max(score, bestScore) :
                    Math.min(score, bestScore);
            }
        });

        return bestScore;
    }

    checkWin(player = this.currentPlayer) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern =>
            pattern.every(index => this.board[index] === player)
        );
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    updateBoard() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.textContent = this.board[index];
        });
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = message ||
            `Current Player: ${this.currentPlayer}`;
    }

    renderHomeScreen() {
        document.getElementById('home-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
    }
}

// Initialize the game
new TicTacToe();
