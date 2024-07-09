
import React, { useContext, useEffect } from 'react'
import { GameContext, SocketContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import './Lobby.css';

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
    <div id="main">
      <div>
      <h1 className="Title">Lobby</h1>
      </div>      
      <div id="waiting-text-div">
        <p className="watiting-text">Waiting for second player . . . </p>
      <p className="waiting-text">Share the below invite code to another player to start game</p>

      </div>
      <div id="invite-code-div">
        <h3 id="invite-code-text">Invite Code</h3>
        <h1 id="invite-code">{gameInfo.roomId}</h1>      
    </div>
    </div>
  )
}
