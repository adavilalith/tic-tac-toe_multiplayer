import React, { useContext, useEffect } from 'react'
import { SocketContext } from '../../App'
import { useNavigate } from 'react-router-dom'

export default function Lobby() {
  const navigate = useNavigate()  
  const socket = useContext(SocketContext)
  console.log(socket.id)

  socket.on("gameStart",(msg)=>{
    if(msg=="success"){
        navigate("/GamePage")
    }
 })    
  return (
    <div>
      <h1>lobby</h1>
      <h3>invite code: {socket.id}</h3>
    </div>
  )
}
