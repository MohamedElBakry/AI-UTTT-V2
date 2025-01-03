/**  
 * Intelligent Systems Project — By Mohamed El Bakry.
 * An Intelligent minimax agent with alpha aeta pruning that plays UTTT (Ultimate Tic Tac Toe) versus a human.
*/

"use strict";

import type p5_T from "p5";

import { Agent } from "./ai.ts";
import { BOARD_LEN, board, game, findSubBoardWins, boardWinCheck, isDraw, getSymbol, isValid, getNext, getNextSubBoard, nextSubBoardToPlay, subBoardWinCheck } from "./utils.ts";
import type { State } from "./state.ts";

export function sketch(p: p5_T, state: State) {

    const agentX = new Agent(state, Agent.type.MINIMAX_ALPHA_BETA_PRUNING, Agent.piece.X, false);
    let depth: number;
    const workers = [...new Array(navigator.hardwareConcurrency)].map(() => new Worker( new URL("./ai-worker-new.ts", import.meta.url), { type: "module" }));

    p.setup = function() {
        const WH = p.ceil(p.min(this.windowHeight, this.windowWidth) / 1.24);   // Decrease divisor to increase the Canvas size
        p.createCanvas(WH, WH);
        // Allow the Agent to make the first move. Comment to allow the human to play first.
        // makeAIMove();
        // We run it once to warm up the function as the first run seems to be the slowest.
        // agentX.generateOptimalMoveSingleThreaded(depth);
        agentX.generateOptimalMove(depth, workers);
        state.turn = agentX.opponentPiece;
    }

    p.windowResized = function(ev) {
        const WH_New = p.ceil(p.min(this.windowHeight, this.windowWidth) / 1.24);
        p.resizeCanvas(WH_New, WH_New);
    }

    document.querySelector("button#undo")?.addEventListener("click", () => { 
        console.log("Undo");
        
        // p.noLoop() occurs at the end of the game. this ensures the player can undo even after a game over
        if (!p.isLooping()) {
            p.loop();
            game.gameOver = false;
            document.querySelector("#gameResult")?.remove();
        }

        state.undo();

        boardWinCheck(state.subBoardStates);

        if (state.previousMove === null)
            return;

        const [x, y] = [state.previousMove.x, state.previousMove.y];
        let subBoardCoords = getNextSubBoard(x, y);
        nextSubBoardToPlay[0] = subBoardCoords.y;
        nextSubBoardToPlay[1] = subBoardCoords.x;
    });

    document.querySelector("button#reset")?.addEventListener("click", () => {
        console.log("Reset");
        state.reset(game.O);

        if (!p.isLooping()) {
            p.loop();
            game.gameOver = false;
            document.querySelector("#gameResult")?.remove();
        }
        
    });

    p.mouseClicked = mouseClicked;

    p.draw = function() {
        p.background(255);

        const w = p.width / BOARD_LEN;
        const h = p.height / BOARD_LEN;

        const [width, height] = [p.width, p.height]; // for ease instead of writing p5.width... 

        const scaledWeight = p.floor(width / 212);
        p.strokeWeight(scaledWeight);
        p.stroke(0);
        p.noFill();

        p.rect(0, 0, width, height);

        // Draw the board
        for (let x = 0; x < BOARD_LEN; x++) {
            for (let y = 0; y < BOARD_LEN; y++) {

                let pos = board[x][y];
                let xp = w * y + w / 2;
                let yp = h * x + h / 2;
                
                p.strokeWeight(scaledWeight);
                // p.text(`${x}, ${y}`, xp - scaledWeight / 2, yp - scaledWeight / 2);
                if (pos == game.O) {
                    p.ellipse(xp, yp, w / 2);  // Radius is w / 2 to make the circle slightly smaller than the square its in.
                }
                else if (pos == game.X) {
                    // Top right to bottom left, and top left to bottom right
                    drawX(w, xp, yp);
                }

                // Draw the dividing lines between, and extra thick horizontal lines if between sub-boards.
                drawDividingLines(w, x, h, y);
            }

            // Thicker/weightier vertical lines because this is a seperate sub-board.
            drawThickerVerticalLines(x, w);

        }

        highlightNextSubBoard(w, h);


        findSubBoardWins(p, state, true);

        const winner = boardWinCheck(state.subBoardStates);
        game.draw = isDraw(state.board);

        if (winner && !game.gameOver) {
            const paragraph = document.createElement("p");
            paragraph.id = "gameResult"
            paragraph.style.fontSize = "xxx-large";
            paragraph.innerText = `${getSymbol(winner)} wins!`;
            document.querySelector("body")?.appendChild(paragraph);
            console.log("VICTORY FOR", getSymbol(winner));
            game.gameOver = true;
            p.noLoop();
        }
    }

    /* When the mouse is clicked, do the move if it's valid, then let the AI reply  */
    function mouseClicked() {

        
        const y = Math.floor(p.mouseX / (p.width / BOARD_LEN));
        const x = Math.floor(p.mouseY / (p.height / BOARD_LEN));
        
        console.log(state, x, y);
        if (!isValid(x, y, state) || game.gameOver || game.draw) {
            return;
        }

        state.board[x][y] = state.turn;
        state.previousMove = { y, x };
        state.turn = getNext(state.turn);

        let subBoardCoords = getNextSubBoard(x, y);
        nextSubBoardToPlay[0] = subBoardCoords.y;
        nextSubBoardToPlay[1] = subBoardCoords.x;

        state.moveHistory.push({turn: state.turn, x, y})

        makeAIMove(workers);
    }

    // /* Draw loop helper functions */
    function highlightNextSubBoard(w: number, h: number) {
        p.strokeWeight(p.floor(p.width / 85.5));
        p.stroke(0, 125, 255);

        const [sbx, sby] = [nextSubBoardToPlay[0], nextSubBoardToPlay[1]];
        const nextSubBoardIsFull = sbx !== -2 && state.subBoardStates[sby][sbx] !== game.none;
        if (state.previousMove === null || nextSubBoardIsFull) {
            p.rect(0, 0, w * BOARD_LEN, w * BOARD_LEN);
            return;
        }
        p.rect(w * (sbx * 3), h * sby * 3, w * 3, h * 3);

    }

    function drawThickerVerticalLines(x: number, w: number) {
        if ((x + 1) % 3 == 0) {
            p.strokeWeight(p.floor(p.width / 85.5));
            p.line(w * (x + 1), 0, w * (x + 1), p.height);
        }
    }

    function drawDividingLines(w: number, x: number, h: number, y: number) {
        p.line(w * (x + 1), 0, w * (x + 1), p.height); // Vertical lines
        p.line(0, h * (y + 1), p.width, h * (y + 1)); // Horizontal lines


        // Thicker/weightier because this is a seperate sub-board.
        if ((y + 1) % 3 == 0) {
            p.strokeWeight(p.floor(p.width / 85.5));
            p.line(0, h * (y + 1), p.width, h * (y + 1));
        }
    }

    function drawX(w: number, xp: number, yp: number) {
        let xr = w / 4;
        p.line(xp + xr, yp - xr, xp - xr, yp + xr);
        p.line(xp - xr, yp - xr, xp + xr, yp + xr);
    }

    function makeAIMove(workers: Worker[]) {
        // if (depth === undefined) {
        //   depth = +prompt("How many turns ahead do you want the AI to look? (higher -> more challenging) — 6 is recommended.");
        //   depth = depth ? depth : 6;
        // }
        // Call the ai move slightly later to allow the draw loop to show the human's previous move.
        setTimeout(async () => {
            p.noLoop();
            // console.log("aiMove")
            // const aiMove = await agentX.generateOptimalMoveSingleThreaded(depth) as {x: number, y: number};
            const aiMove = await agentX.generateOptimalMove(depth, workers) as {x: number, y: number};
            // console.log("after", aiMove)
            p.loop();
            state.board[aiMove.x][aiMove.y] = agentX.piece;
            state.previousMove = aiMove;
            state.turn = agentX.opponentPiece;

            state.moveHistory.push({turn: state.turn, x: aiMove.x, y: aiMove.y});

            const subBoardCoords = getNextSubBoard(aiMove.x, aiMove.y);
            nextSubBoardToPlay[0] = subBoardCoords.y;
            nextSubBoardToPlay[1] = subBoardCoords.x;

        }, 100);
    }
}
