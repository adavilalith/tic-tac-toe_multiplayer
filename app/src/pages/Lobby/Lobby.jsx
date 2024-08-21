
import React, { useContext, useEffect, useState } from 'react'
import { GameContext, SocketContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import './Lobby.css';

export default function Lobby() {
  const navigate = useNavigate()  
  const socket = useContext(SocketContext)
  const gameInfo = useContext(GameContext)  

  const [dummuy,setDummy] = useState(false)

  useEffect(()=>{
    if(!gameInfo.inGame){
      navigate("/Home")
    }
  },[])
  socket.on("gameStart",(msg)=>{
    if(msg=="success"){
        gameInfo.inGame=true
        navigate("/GamePage")
    }
 })    
  const handleDuel = ()=>{
    gameInfo.duelOpen = !gameInfo.duelOpen
    socket.emit("openDuel",gameInfo.duelOpen)
    setDummy(gameInfo.duelOpen)
  }
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
      <div id="duel-div">
        <button id={"duel-btn-"+((!gameInfo.duelOpen)?"open":"close")} onClick={handleDuel}>{(!gameInfo.duelOpen)?"Open Duel":"Close Duel"}</button>
      </div>
    </div>
  )
}
