import React, { useContext, useEffect, useState } from 'react'
import TicTacToeBoard from "../../components/TickTacToeBoard/TicTacBoard"
import { SocketContext } from '../../App'

export default function GamePage() {
  const [player,setPlayer]=useState()
  const [roomId,setRoomId]=useState()
  const socket = useContext(SocketContext)
  
  useEffect(()=>{
    socket.emit("playersInfo",socket.id) 
    socket.on("playersInfo",(data)=>{
      data =JSON.parse(data)
      // console.log(data)
      setPlayer(Number(data[socket.id]))
      setRoomId(data[roomId])
    })
  },[])
  return (
    <div>
      <TicTacToeBoard roomId={roomId} player={player}></TicTacToeBoard>
    </div>
  )
}
