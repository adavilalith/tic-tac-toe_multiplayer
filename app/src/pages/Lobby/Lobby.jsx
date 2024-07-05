import React, { useContext, useEffect } from 'react'
import { GameContext, SocketContext } from '../../App'
import { useNavigate } from 'react-router-dom'

export default function Lobby() {
  const navigate = useNavigate()  
  const socket = useContext(SocketContext)
  const gameInfo = useContext(GameContext)  


  useEffect(()=>{
    if(!gameInfo.inGame){
      navigate("/home")
    }
  },[])
  socket.on("gameStart",(msg)=>{
    if(msg=="success"){
        gameInfo.inGame=true
        navigate("/GamePage")
    }
 })    
  return (
    <div>
      <h1>lobby</h1>
      <h3>invite code:</h3>
      <h1>
      {gameInfo.roomId}
      </h1>
    </div>
  )
}
