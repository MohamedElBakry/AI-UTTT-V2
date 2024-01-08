export class State {

    board: number[][];
    subBoardStates: number[][];
    previousMove: { y: number; x: number; };
    turn: number;
    
    /** Create a copy of the board and subBoardStates to allow for modification during simulation
     *  without the need for proper undoing of moves/actions
     * @param {number[][]} board
     * @param {number[][]} subBoardStates
     * @param {{y: number, x: number}} previousMove         // This is just an object with an x and y number component.
     * @param {number} turn
     */
    constructor(board: number[][], subBoardStates: number[][], previousMove: { y: number; x: number; }, turn: number, doCopy: boolean) {
        // this.board = (doCopy) ? board.map((row) => [...row]) : board;
        // this.subBoardStates = (doCopy) ? subBoardStates.map((row) => [...row]) : subBoardStates;
        // Array.prototype.slice is more performant than the spread operator ([...Array]), so the former is now used

        this.board = (doCopy) ? board.map((row) => row.slice(0)) : board;
        this.subBoardStates = (doCopy) ? subBoardStates.map((row) => row.slice(0)) : subBoardStates;
        this.previousMove = previousMove;
        this.turn = turn;
    }
}
