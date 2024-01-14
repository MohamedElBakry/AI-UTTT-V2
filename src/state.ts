export class State {

    board: number[][];
    subBoardStates: number[][];
    previousMove: { y: number, x: number; };
    moveHistory: Array<{turn: number, y: number, x: number; }>;
    turn: number;
    
    /** Create a copy of the board and subBoardStates to allow for modification during simulation
     *  without the need for proper undoing of moves/actions
     * @param {number[][]} board
     * @param {number[][]} subBoardStates
     * @param {{y: number, x: number}} previousMove         // This is just an object with an x and y number component.
     * @param {number} turn
     */
    constructor(board: number[][], subBoardStates: number[][], previousMove: { y: number, x: number; }, turn: number, doCopy: boolean) {
        // this.board = (doCopy) ? board.map((row) => [...row]) : board;
        // this.subBoardStates = (doCopy) ? subBoardStates.map((row) => [...row]) : subBoardStates;
        // Array.prototype.slice is more performant than the spread operator ([...Array]), so the former is now used

        this.board = (doCopy) ? board.map((row) => row.slice(0)) : board;
        this.subBoardStates = (doCopy) ? subBoardStates.map((row) => row.slice(0)) : subBoardStates;
        this.previousMove = previousMove;
        this.moveHistory = new Array();
        this.turn = turn;
    }


    undo() {
        if (this.moveHistory.length === 0)
            return;
    
        // ai move undo
        const {turn: _, x: hx, y: hy} = this.moveHistory.pop()!;
        this.board[hx][hy] = 0;

        // human player move undo
        const {turn, x, y} = this.moveHistory.pop()!;    // if we've reached the start of the game, return null for any move to be valid
        this.turn = 2;
        this.previousMove = {x, y};
        this.board[x][y] = 0;
        
        console.log(this.moveHistory);

        if (this.moveHistory.length === 0) {
            this.previousMove = null!;
            return;
        }

        const { x: newPrevX, y: newPrevY } = this.moveHistory[this.moveHistory.length - 1];
        this.previousMove = {x: newPrevX, y: newPrevY};
    }

    redo() {

    }

    // resets the game by making the board and sub-board states be set to 0.
    // and making the previousMove null to allow any move and make O the first player. 
    reset(turn: number): void {
        this.board = this.board.map((row) => row.fill(0));
        this.subBoardStates = this.subBoardStates.map((row) => row.fill(0));
        this.previousMove = null!;
        this.turn = turn;
    }
}
