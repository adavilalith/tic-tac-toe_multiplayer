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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id+'connected');

  socket.on("createGame",(sId)=>{
    console.log("room "+sId+" created ")

    socket.join(String(sId))
  })
  socket.on("joinGame",(sId)=>{
    socket.join(String(sId))
    console.log(socket.id+" room "+sId+" joined ")

  })
  socket.emit("hello","hi "+socket.id)
  socket.on("disconnect",()=>{
    console.log(socket.id+" disconnected")
  })
});

server.listen(3000, () => {
  console.log('listening *:3000');
});