# AI Ultimate Tic Tac Toe
This is a university turned mini-passion project in JavaScript on Intelligent Systems (AI) for the Ultimate Tic Tac Toe game.
It uses the P5.js library for the graphics.

Ultimate Tic Tac Toe, as the name suggests, is an advanced version of the well-known game, Tic Tac Toe.
Similarily, the goal is to win 3 sub-boards in a line, and to win a sub-board you must form a line in it. Additionally, here's where it becomes challenging:
the previous move influences/limits the options of the next move. That is, each square maps to a sub-board. Thus, long-term planning and strategy are key! 

The AI itself is Minimax with Alpha-Beta (α–β) pruning to signficantly speed up the process of travesing the game tree and move options.

## Running the Project
  1. Download the project: 
 ```shell
 git clone https://github.com/MohamedElBakry/AI-Ultimate-Tic-Tac-Toe.git
 ```
  2. In the root directory of the project, serve/run it to localhost e.g.: 
  ```shell
  cd AI-Ultimate-Tic-Tac-Toe
  python -m http.server
  ```
  3. Open localhost in a browser and navigate to the src directory. If you used python the command above then follow this link: [localhost](http://localhost:8000/src).

Finally, while playing you may press `F12` then select the `Console` tab to see the AI's evaluation of the current positon in real time.

 ## Example Game
 The following image illustrates a game where the AI, as `X`, won versus the developer of this repo who was `O`.
 
 ![The AI being victorious over a human.](images/Example-AI-Victory.png)
