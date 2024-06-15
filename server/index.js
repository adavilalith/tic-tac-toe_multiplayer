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
    rooms[roomId][socket.id]=0
    socket.join(roomId)
    console.log(rooms)
  })

  socket.on("joinGame",(roomId)=>{
    if(rooms[roomId]["count"]<2){
      socket.join(roomId)
      rooms[roomId]["count"]=2;
      rooms[roomId][socket.id]=1
    console.log(socket.id+" joined "+" room "+roomId)
    io.in(roomId).emit("gameStart","success")
    
  }
    else{
      console.log("room full!!!")
      socket.emit("joinGame","fail")
    }
  })
  socket.on("playersInfo",(roomId)=>{
    if(rooms[roomId]){
      console.log(socket.id, "getting info of ",roomId)
      io.in(roomId).emit("playersInfo",JSON.stringify(rooms[roomId]))
    }
  })

  socket.on("turn",(data)=>{
    data =JSON.parse(data)
    console.log(data.move,rooms[data.roomId])
    io.in(data.roomId).emit("turn",data.move);
  })

  socket.on("disconnecting", () => {
    console.log("disconnecting",socket.rooms)
    for(const room of socket.rooms){
      delete rooms[room];
    }
  });

  socket.on("disconnect",()=>{
    console.log(socket.id+" disconnected")
    console.log(rooms)
  })


});

server.listen(3000, () => {
  console.log('listening *:3000');
});