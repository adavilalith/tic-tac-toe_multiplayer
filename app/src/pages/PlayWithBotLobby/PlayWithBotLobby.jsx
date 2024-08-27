import React, { useState ,useContext, useEffect} from 'react'
import './PlayWithBotLobby.css'
import { useNavigate } from "react-router-dom";
import { GameContext, SocketContext } from '../../App';
import axios from 'axios';
import { backendURL } from '../../config/backendURL';

export default function PlayWithBotLobby() {
  const socket = useContext(SocketContext)
  const gameInfo = useContext(GameContext)
  const navigate = useNavigate()

  const [difficultyLevel,setDifficultyLevel] = useState(2)
  let colors = ["greenyellow","green","yellow","orange","red"]
  const difficulties = ["First Game", "Easy Peasy", "I want to Play","Give me a Challenge ","Impossible To Win"]


  useEffect(()=>{
    if(!gameInfo.inLobby||!socket.id){
      navigate("/Home")
    }
  },[])

  const handleStartBotGame = ()=>{
    gameInfo.inLobby=false
    gameInfo.inGame=true
    socket.emit("startBotGame",difficultyLevel)
    navigate("/BotGamePage")
  }
  const handleLeavingLobby = ()=>{
    navigate("/Home")
  }
  
  return (
    <div id="main">
      <div className="Title">
        <h2 >Player vs Bot</h2>
      </div>
      <h2>Select Diffuculty:</h2>     
      <h2 style={{"color": `${colors[difficultyLevel-1]}`}}>{`${difficulties[difficultyLevel-1]}`}</h2> 
      <input id="difficulty-slider" type="range" max="5" min="1" value={difficultyLevel} onChange={(e)=>setDifficultyLevel(e.target.value)} style={{accentColor: `${colors[difficultyLevel-1]}`}}/>
      <button id="start-game-btn" onClick={handleStartBotGame}>Start Game</button>
      <button id="exit-lobby-btn" onClick={handleLeavingLobby}>Exit Lobby</button>
    </div>
  )
}