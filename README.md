# **Multiplayer Tic Tac Toe with AI (kinda)**

Welcome to the **Multiplayer Tic Tac Toe** game! This project is a dynamic and interactive tic tac toe game built with a modern tech stack including React, Express, and Socket.IO. The game allows users to engage in real-time matches against other players or a basic AI opponent powered by the minimax algorithm.

The game features a clean, user-friendly interface designed with a mobile-first approach, ensuring an optimal experience across devices. Players can easily create or join games with friends and family, making for an engaging and enjoyable experience. Whether you’re a casual player or looking for a challenge against the AI, this game offers a fun and accessible way to enjoy tic tac toe.

Visit the site here: https://tic-tac-toe-seven-inky-65.vercel.app/

![ezgif-1-811fe2c310](https://github.com/user-attachments/assets/be863fa4-284c-428b-a8aa-9d1b94b454f0)


## Features

- **Real-time Multiplayer Gameplay**: Engage in live matches with friends or other players.
- **AI Opponent**: Challenge a computer opponent using a basic implementation of the minimax algorithm.
- **User-Friendly Interface**: Designed to be intuitive and easy to navigate.
- **Mobile First Design**: Fully optimized for mobile devices to ensure a great experience on the go.
- **Game Creation and Joining**: Easily create new games or join existing ones using a unique game ID.


## Technologies

- **React**: Frontend library for building the interactive user interface.
- **Axios**: Handles HTTP requests between the frontend and backend.
- **Socket.IO**: Facilitates real-time communication between client and server.
- **Express**: Backend framework for managing server-side operations and API routes.
- **Minimax Algorithm**: Powers the Tic Tac Toe Bot with strategic decision-making capabilities.


## **Installation:**

1. Clone the repository: `git clone https://github.com/your-username/tic-tac-toe`
2. Change the directory to server: `cd server`
3. Start socket.io server: `nodemon index.js` or `node index.js`
4. Run the server: `npm start`
5. Change the directory to app: `cd app`
6. Install dependencies: `npm i`
7. Change backendURL in `src/config/backendURL` to `localhost:8080`
8. Start react server: `npm run dev`
9. Open `http://localhost:5173` in your browser. 

**Usage:**
1. **Enter Your Name**: Start by entering your name in the provided field. This allows you to personalize your gameplay experience and identify yourself to other players.

2. **Create or Join a Game**:
   - **Create a Game**: Click on the "Create Game" button to start a new game session. Share the unique room code with friends to invite them.
   - **Join a Game**: Enter the room code provided by the host to join an existing game.

3. **Duel Feature**: You can also use the duel feature to challenge a specific player directly if thier room is open to dueling.

4. **Play Against AI**: Select the AI option if you prefer to play against the computer.

5. **The first player to get three in a row wins!**

## Minimax Algorithm

The **minimax algorithm** is used in game theory and AI to determine the optimal move in two-player games. It assumes both players play optimally—one trying to maximize their score and the other trying to minimize it.

### How It Works

1. **Game Tree**: 
   - Constructs a tree of possible game states from the current position.

2. **Minimizing and Maximizing**:
   - The **MAX player** aims to maximize their score.
   - The **MIN player** aims to minimize the MAX player’s score.

3. **Recursive Evaluation**:
   - Recursively evaluates each game state.
   - Terminal states (end of the game) are assigned scores: +1 for a win, -1 for a loss, 0 for a draw.
   - Scores are propagated back up the tree:
     - MAX nodes take the maximum score of their children.
     - MIN nodes take the minimum score of their children.

4. **Optimal Move**:
   - Selects the move at the root that maximizes the score for the MAX player.
