const { error } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const { stringify } = require('querystring');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors:{
    origin:"*",
  },
}
);

let rooms = {}
let players = {}

const checkWinner = (board)=>{
  console.log("checking")
  const winCond = [[0,1,2],
                   [3,4,5],
                   [6,7,8],
                   [0,3,6],
                   [1,4,7],
                   [2,5,8],
                   [0,4,8],
                   [2,4,6],
                  ]
  for(let cond=0;cond<8;cond++){
      let Xwin=true;
      let Owin=true;
      for(let i=0;i<3;i++){
          if(board[winCond[cond][i]]!="X"){
              Xwin=false;
              break;
          }
      }
      for(let i=0;i<3;i++){
          if(board[winCond[cond][i]]!="O"){
              Owin=false;
              break;
          }
      }
      if(Xwin){
          return 1;
      }
      if(Owin){
          return 1;    
      }
      let fullCond=true
      for(let i=0;i<9;i++){
          if(board[i]==" "){
              fullCond=false;
              break;
          }
      }
      if(fullCond){
          setRunning(-1);
      }
      
  }
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id+'connected');

  socket.on("createGame",(roomId)=>{
    console.log("room "+roomId+" created ")
    rooms[roomId]={}
    rooms[roomId]["roomId"]=roomId
    rooms[roomId]["count"]=1
    rooms[roomId]["players"]=[socket.id]
    rooms[roomId]["turn"] = 0


    players[socket.id]={}
    players[socket.id]["turn"]={}
    players[socket.id]["roomId"]=roomId
    players[socket.id]["turn"]=0
    socket.join(roomId)
  })

  socket.on("joinGame",(roomId)=>{
    if(rooms[roomId]["count"]<2){
      socket.join(roomId)
      rooms[roomId]["count"]=2;
      rooms[roomId]["players"].push(socket.id)
      rooms[roomId]["board"]=[" "," "," ",
        " "," "," ",
        " "," "," ",]
      rooms[roomId]["turn"] = 0

      players[socket.id]={}
      players[socket.id]["roomId"]=roomId
      players[socket.id]["turn"]=1


      console.log(socket.id+" joined "+" room "+roomId)
      io.in(roomId).emit("gameStart","success")
  }
    else{
      console.log("room full!!!")
      socket.emit("joinGame","fail")
    }
  })


  socket.on("gameTurn",(move)=>{
      const roomId = players[socket.id]["roomId"]

      if(rooms[roomId]["turn"]==-1){
        rooms[roomId].board=[" "," "," ",
          " "," "," ",
          " "," "," ",]
          io.in(roomId).emit("gameTurn",JSON.stringify(
            { "status":0,
              "board":rooms[roomId]["board"],
              "outputMsg":""   
            }))
            rooms[roomId].turn+=1
      }
      else{
        if(socket.id==rooms[roomId]["players"][(rooms[roomId]["turn"])%2]){
          rooms[roomId]["board"][move] = (rooms[roomId]["turn"]%2==0)?"X":"O";
          const res = checkWinner(rooms[roomId]["board"])
          if(res==1){
            rooms[roomId]["turn"]=-1
            io.in(roomId).emit("gameTurn",JSON.stringify(
              { "status":1,
                "board":rooms[roomId]["board"],
                "outputMsg": `The Winner is ${socket.id}`   
              }))
          }
          else if(res==-1){
            rooms[roomId]["turn"]=-1
            io.in(roomId).emit("gameTurn",JSON.stringify(
              { "status":1,
                "board":rooms[roomId]["board"],
                "outputMsg": `The game is a tie`   
              }))
          }
          else{
            rooms[roomId]["turn"]+=1

          io.in(roomId).emit("gameTurn",JSON.stringify(
          { "status":0,
            "board":rooms[roomId]["board"],  
            "outputMsg":"",
          }))
          }
          
        }
        else{
          io.in(roomId).emit("gameTurn",JSON.stringify(
            { "status":10,
              "outputMsg":"not your turn"  
            }))
        }
      }
  })




 

  socket.on("disconnecting", () => {
    console.log("disconnecting",socket.rooms)
    for(const room of socket.rooms){
      delete rooms[room];
    }
    delete players[socket.id]
  });

  socket.on("disconnect",()=>{
    console.log(socket.id+" disconnected")
    console.log(rooms)
  })


});

server.listen(3000, () => {
  console.log('listening *:3000');
});