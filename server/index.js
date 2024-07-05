const { error } = require('console');
const bodyParser = require('body-parser'); 

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
let namesToPlayers = {}


app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});


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

const generateRoomId = ()=>{
  return Math.floor(Math.random()*2100000000).toString(36)
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post("/createUser",(req,res)=>{
  const socketId = req.body.socketId;
  const userName = req.body.userName;
  if(userName in namesToPlayers ){
    return res.send(JSON.stringify({status:1,msg:"userName already exists"}))
  }
  else{
      if(players[socketId]){
        for (let name in namesToPlayers){
          if(namesToPlayers[name]==socketId){
            delete namesToPlayers[name];
          }
        }
      }
      players[socketId]={
        name:userName,
        inGame:false,
        roomId:null,
        turn:null,   
    }
    namesToPlayers[userName]=socketId;
    console.log(namesToPlayers)
    return res.send(JSON.stringify({status:0,msg:""}))
  }
})

app.post("/createGame",(req,res)=>{
  const socketId = req.body.socketId;
  let roomId=String(generateRoomId())
    players[socketId]["roomId"]=roomId;
    players[socketId]["turn"]=0
    players[socketId]["inGame"]=true;
    rooms[roomId]={
      roomId:roomId,
      count:1,
      players:[socketId],
      turn:0,
    }

    console.log("room "+roomId+" created ")

    res.send(JSON.stringify({status:0,roomId:roomId}))
})

io.on('connection', (socket) => {
  console.log(socket.id+' connected');

  socket.on("createGame",(roomId)=>{
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
      players[socket.id]["inGame"]=true
      players[socket.id]["turn"]=1
      console.log(players[socket.id])


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
      console.log(socket.id,roomId)
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
                "outputMsg": `The Winner is ${players[socket.id]["name"]}`   
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
    for(const name in namesToPlayers){
      if(namesToPlayers[name]==socket.id){
        delete namesToPlayers[name];
      }
    }
  });

  socket.on("disconnect",()=>{
    console.log(socket.id+" disconnected")
    console.log(rooms)
  })


});

server.listen(8080, () => {
  console.log('listening *:8080');
});