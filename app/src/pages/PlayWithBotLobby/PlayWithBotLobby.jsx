import React, { useState } from 'react'
import './PlayWithBotLobby.css'


export default function PlayWithBotLobby() {
  const [difficultyLevel,setDifficultyLevel] = useState(2)
  let colors = ["greenyellow","green","yellow","orange","red"]
  const difficulties = ["Impossible To Lose", "Easy Peasy", "I want to Play","Give me a Challenge ","Impossible To Win"]
  return (
    <div id="main">
      <div id="Title">
        <h1 >Player</h1>
        <h1>vs</h1>
        <h1>Bot</h1>
      </div>
      <h2>Select Diffuculty:</h2>     
      <h2 style={{"color": `${colors[difficultyLevel-1]}`}}>{`${difficulties[difficultyLevel-1]}`}</h2> 
      <input id="difficulty-slider" type="range" max="5" min="1" value={difficultyLevel} onChange={(e)=>setDifficultyLevel(e.target.value)} style={{accentColor: `${colors[difficultyLevel-1]}`}}/>
      <button id="start-game-btn">Start Game</button>
    </div>
  )
}