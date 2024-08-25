const bodyParser = require("body-parser");
const { Socket } = require("dgram");
const express = require("express");
const app = express();
const http = require("http");
const { stringify } = require("querystring");
const server = http.createServer(app);
const { Server } = require("socket.io");


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let rooms = {};
var players = {};
let namesToPlayers = {};

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

    
const bestMove =(board,wantToWin)=>{
  let bestScore = -Infinity;
  let move="nomove";
  for(let i=0;i<9;i++){
      if(board[i]==" "){
          board[i]="O";
          let score = minimax(board,(wantToWin)?false:true);
          board[i]=" ";
          if(score>bestScore){
              bestScore = score;
              move=i;
          }
      }
      
  }
  return move;
}

const minimax = (board,isMaxMin)=>{
  let res = checkWinner(board);
  if(res==1){
      return -1;
  }
  if(res==2){
      return 1;
  }
  if(res==-1){
      return 0;
  }
  let bestScore;
  if(isMaxMin){
      bestScore=-Infinity;
      for(let i=0;i<9;i++){
          if(board[i]==" "){
              board[i]="O";
              let score = minimax(board,!isMaxMin);
              board[i]=" "
              bestScore=Math.max(score,bestScore);
          }
      }
  }
  else{
      bestScore=Infinity;
      for(let i=0;i<9;i++){
          if(board[i]==" "){
              board[i]="X";
              let score = minimax(board,!isMaxMin);
              board[i]=" "
              bestScore=Math.min(score,bestScore);
          }
      }
  }
  return bestScore;
}

const checkWinner = (board) => {
  
  const winCond = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let cond = 0; cond < 8; cond++) {
    let Xwin = true;
    let Owin = true;
    for (let i = 0; i < 3; i++) {
      if (board[winCond[cond][i]] != "X") {
        Xwin = false;
        break;
      }
    }
    if (Xwin) {
      return 1;
    }
    for (let i = 0; i < 3; i++) {
      if (board[winCond[cond][i]] != "O") {
        Owin = false;
        break;
      }
    }
    
    if (Owin) {
      return 2;
    }
  }
  let fullCond = true;
  for (let i = 0; i < 9; i++) {
    if (board[i] == " ") {
      fullCond = false;
      break;
    }
  }
  if (fullCond) {
    return -1;
  }
};

const generateRoomId = () => {
  return Math.floor(Math.random() * 2100000000).toString(36);
};

const resetPlayer = (socketId) => {
  if(players[socketId]){
  players[socketId].name = players[socketId].name;
  players[socketId].inGame = false;
  players[socketId].inLobby = false;
  players[socketId].roomId = null;
  players[socketId].turn = null;
  players[socketId].duelOpen = false;
  }
};

const clearPlayer = (socketId) => {
  for (const n in Object.keys(namesToPlayers)) {
    if (namesToPlayers[n] == socketId) {
      delete namesToPlayers[n];
    }
  }
  for (const r in Object.keys(rooms)) {
    if (rooms[r]) {
      const playersInRoom = rooms[r].players;
      if (playersInRoom[0] == socketId || playersInRoom[1] == socketId) {
        delete rooms[r];
      }
    }
  }
  for (const p in Object.keys(players)) {
    if (players[p] == socketId || p == socketId) {
      delete players[p];
    }
  }
};

app.get("/", (req, res) => {
  res.send("why are you looking here?");
});

app.post("/createUser", (req, res) => {
  const socketId = req.body.socketId;
  const userName = req.body.userName;
  if (userName in namesToPlayers && namesToPlayers[userName] != userName) {
    return res.send(
      JSON.stringify({ status: 1, msg: "userName already exists" })
    );
  } else {
    clearPlayer(socketId);
    players[socketId] = {
      name: userName,
      inGame: false,
      inLobby: false,
      roomId: null,
      turn: null,
      duelOpen: false,
    };
    namesToPlayers[userName] = socketId;
    console.log(socketId, " user created");
    return res.send(JSON.stringify({ status: 0, msg: "" }));
  }
});

app.post("/createGame", (req, res) => {
  const socketId = req.body.socketId;
  if(!players[socketId]){
    return   res.send(JSON.stringify({ status: 1}));
  }
  let roomId = String(generateRoomId());
  players[socketId]["roomId"] = roomId;
  players[socketId]["turn"] = 0;
  players[socketId]["inGame"] = true;
  players[socketId]["inLobby"] = true;
  players[socketId]["duelOpen"] = false;
  rooms[roomId] = {
    roomId: roomId,
    count: 1,
    players: [socketId],
    turn: 0,
  };
  console.log("room " + roomId + " created ");
  res.send(JSON.stringify({ status: 0, roomId: roomId }));
});

app.post("/resetUser", (req, res) => {
  const socketId = req.body.socketId;
  resetPlayer(socketId);
  res.send();
});

app.post("/clearPlayer", (req, res) => {
  const socketId = req.body.socketId;
  clearPlayer(socketId);
  res.send();
  console.log(socketId, "cleared");
});

app.get("/test", (req, res) => {
  res.send({ message: "Hello World" });
});

io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  const clearUselessDate = async () => {
    const sockets = await io.fetchSockets();
    for (const socketId in sockets) {
      // deleting useless player info
      for (const p in Object.keys(players)) {
        if (!(p in sockets)) {
          delete players[p];
        }
      }
      // deleting useless nameToPlayer info
      for (const n in Object.keys(namesToPlayers)) {
        if (!(namesToPlayers[n] in sockets)) {
          delete namesToPlayers[n];
        }
      }
      //deleting useless
      for (const r in Object.keys(rooms)) {
        if (rooms[r]) {
          const p1 = rooms[r].players[0];
          const p2 = rooms[r].players[1];
          if (!(p1 in sockets) || !(p2 in sockets)) {
            delete rooms[r];
          }
        }
      }
    }
  };

  socket.on("getPlayers",()=>{
    clearUselessDate();
    io.emit("getPlayers", JSON.stringify(players));
  })

  socket.on("leaveGame", () => {
    if (players[socket.id] && players[socket.id]["roomId"]) {
      const roomId = players[socket.id]["roomId"];

      for (const room in rooms) {
        if (players[socket.id] && room["roomId"] == roomId) {
          delete rooms[room];
        }
      }
      io.in(roomId).emit(
        "gameTurn",
        JSON.stringify({ status: 20, outputMsg: "" })
      );

      players[socket.id].inGame = false;
      players[socket.id].inLobby = false;
      players[socket.id].duelOpen = false;
      players[socket.id].turn = null;
      players[socket.id].roomId = null;

      
    io.emit("getPlayers", JSON.stringify(players));
    console.log(socket.id, " exited ", roomId);
      socket.leave(players[socket.id]["roomId"]);
    }
    
  });

  socket.on("joinBotLobby",()=>{
    players[socket.id].inLobby = true
    io.emit("getPlayers", JSON.stringify(players));
  })

  socket.on("startBotGame",(difficultyLevel)=>{
    if(players[socket.id]){
    console.log(difficultyLevel)
    players[socket.id].inLobby = false
    rooms[socket.id]={
                      board:[" ", " ", " ", " ", " ", " ", " ", " ", " "],
                      turn:0,
                      difficultyLevel:Number(difficultyLevel),
                      isRunning:true,
                    }

    io.emit("getPlayers", JSON.stringify(players));
                  }
  })

  socket.on("botGameTurn",(cell)=>{
    
    if(rooms[socket.id]){
      if(rooms[socket.id].isRunning==false){
        io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:10,msg:"Reset Game"}))    
        return;
      }
      if(rooms[socket.id].board){
        let board = rooms[socket.id].board 
        if(rooms[socket.id].board[cell]==" "){
          board[Number(cell)]="X"
          let res;
          res=checkWinner(board)
          if(res==1||res==2){
            io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:res,board:board,msg:(res==1)?"player wins":"bot wins"})) 
            rooms[socket.id].isRunning=false;   
            return;
          }
          if(res==-1){
            io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:res,board:board,msg:"Tie"}))    
            rooms[socket.id].isRunning=false;   
            return;
          }
          const arr = [1,2,3,4]
          if(arr[Math.floor(Math.random()*arr.length)]<rooms[socket.id].difficultyLevel){
            res=bestMove(board,true)
          }
          else{
            res=bestMove(board,false)
          }

          board[res]="O"
          res=checkWinner(board)
          if(res==1||res==2){
            io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:res,board:board,msg:(res==1)?"player wins":"bot wins"}))    
            rooms[socket.id].isRunning=false;   
            return;
          }
          if(res==-1){
            io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:res,board:board,msg:"Tie"}))    
            rooms[socket.id].isRunning=false;   
            return;
          }
          rooms[socket.id].board=board
          io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:0,board:board,msg:""}))    
          return;
        }
        else{
          io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:10,msg:"cell is full"}))    
          return;
        }
      }
    }
    io.sockets.in(socket.id).emit("botGameTurn",JSON.stringify({status:20,msg:""}))
    
  })

  socket.on("resetBotGame",()=>{
      if(rooms[socket.id]){
        rooms[socket.id]={
          board:[" ", " ", " ", " ", " ", " ", " ", " ", " "],
          turn:0,
          difficultyLevel:rooms[socket.id].difficultyLevel,
          isRunning:true,
        }
      }
  })


  socket.on("createGame", (roomId) => {
    socket.join(roomId);
    io.emit("getPlayers", JSON.stringify(players));
  });

  socket.on("openDuel",(cond)=>{
    if(players[socket.id]){
    console.log(socket.id,"|",cond)
    players[socket.id].duelOpen=cond;
    io.emit("getPlayers", JSON.stringify(players));
    }
  })

  socket.on("joinGame", (roomId) => {
    if (rooms[roomId] && rooms[roomId]["count"] < 2) {
      socket.join(roomId);
      rooms[roomId]["count"] = 2;
      rooms[roomId]["players"].push(socket.id);
      rooms[roomId]["board"] = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
      rooms[roomId]["turn"] = 0;

      players[socket.id]["roomId"] = roomId;
      players[socket.id]["inGame"] = true;
      players[socket.id].inLobby = false;
      players[socket.id].duelOpen = false;
      players[socket.id]["turn"] = 1;
      players[socket.id].isRunning = true;

      players[rooms[roomId].players[0]].inLobby = false;

      console.log(socket.id + " joined " + " room " + roomId);
      io.in(roomId).emit("gameStart", "success");
      io.emit("getPlayers", JSON.stringify(players));
    } else {
      console.log(socket.id, " tried to join", roomId, " room full");
      socket.emit("joinGame", "fail");
    }
  });

  socket.on("resetGame", () => {
    if (!players[socket.id]) {
      return;
    }
    const roomId = players[socket.id].roomId;
    rooms[roomId].board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    rooms[roomId].isRunning=true;
    io.in(roomId).emit(
      "gameTurn",
      JSON.stringify({
        status: 0,
        board: rooms[roomId]["board"],
        outputMsg: "",
      })
    );
    rooms[roomId].turn = -1;
  });

  socket.on("gameTurn", (move) => {
    if (!players[socket.id]) {
      return;
    }
    if(rooms[players[socket.id].roomId].isRunning==false){
      io.sockets.in(socket.id).emit(
        "gameTurn",
        JSON.stringify({ status: 10, outputMsg: "Reset Game" })
      );
      return;
    }
    const roomId = players[socket.id]["roomId"];
    if (rooms[roomId]["turn"] == -1) {
      rooms[roomId].board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
      io.in(roomId).emit(
        "gameTurn",
        JSON.stringify({
          status: 0,
          board: rooms[roomId]["board"],
          outputMsg: "",
        })
      );
      rooms[roomId].turn += 1;
    }

    if (socket.id == rooms[roomId]["players"][rooms[roomId]["turn"] % 2]) {
      rooms[roomId]["board"][move] = rooms[roomId]["turn"] % 2 == 0 ? "X" : "O";
      const res = checkWinner(rooms[roomId]["board"]);
      if (res == 1||res == 2) {
        console.log(socket.id, " winner in ", roomId);
        rooms[roomId]["turn"] = -1;
        rooms[roomId].isRunning=false;
        io.in(roomId).emit(
          "gameTurn",
          JSON.stringify({
            status: 1,
            board: rooms[roomId]["board"],
            outputMsg: `The Winner is ${players[socket.id]["name"]}`,
          })
        );
      } else if (res == -1) {
        rooms[roomId]["turn"] = -1;
        rooms[roomId].isRunning=false;
        io.in(roomId).emit(
          "gameTurn",
          JSON.stringify({
            status: 1,
            board: rooms[roomId]["board"],
            outputMsg: `The game is a tie`,
          })
        );
      } else {
        rooms[roomId]["turn"] += 1;

        io.in(roomId).emit(
          "gameTurn",
          JSON.stringify({
            status: 0,
            board: rooms[roomId]["board"],
            outputMsg: "",
          })
        );
      }
    } else {
      io.sockets.in(socket.id).emit(
        "gameTurn",
        JSON.stringify({ status: 10, outputMsg: "not your turn" })
      );
    }
  });

  socket.on("disconnecting", () => {
    if (players[socket.id] && players[socket.id]["inGame"] == true) {
      const roomId = players[socket.id]["roomId"];
      console.log(roomId, "game inturupted");
      io.in(roomId).emit(
        "gameTurn",
        JSON.stringify({ status: 20, outputMsg: "" })
      );
    }

    console.log("disconnecting", socket.rooms);
    for (const room of socket.rooms) {
      delete rooms[room];
    }

    for (const room in rooms) {
      if (players[socket.id] && rooms["roomId"] == players[socket.id].roomId) {
        delete rooms[room];
      }
    }

    delete players[socket.id];
    for (const name in namesToPlayers) {
      if (namesToPlayers[name] == socket.id) {
        delete namesToPlayers[name];
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });
});

const port = process.env.PORT || 8080 
server.listen(port, () => {
  console.log("listening *:", port);
});
