const express = require('express');
const app = express();
const http = require('http');
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
    rooms[roomId]=1
    socket.join(roomId)
    console.log(rooms)
  })

  socket.on("joinGame",(roomId)=>{
    if(rooms[roomId]<2){
      socket.join(roomId)
      rooms[roomId]=2;
    console.log(socket.id+" joined "+" room "+roomId)
  io.in(roomId).emit("gameStart","success")
  }
    else{
      console.log("room full!!!")
      socket.emit("joinGame","fail")
    }
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