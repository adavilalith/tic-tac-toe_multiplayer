import React,{useState, useEffect, useContext} from 'react';
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { SocketContext } from '../../App';

export default function HomePage() {
  const navigate = useNavigate()
  const [connectId,setConnectId] = useState()
  const socket = useContext(SocketContext)
  

  const createGame=()=>{
    console.log("try create")
    socket.emit("createGame",socket.id)
    navigate('/Lobby');
  }

  const joinGame=()=>{
    socket.emit("joinGame",connectId)
    socket.on("gameStart",(msg)=>{
      console.log(msg)
      if(msg=="success"){
        console.log("lets play")
        navigate("/GamePage")
      }
      else{
        alert("room full")
      }
    })
  }
  return (
    <>
    <div id="homemain">
      <div className="Title">
        <h1>Tic Tac Toe</h1>
      </div>
      <div id="createGame">
        <button onClick={createGame}>create game</button>
      </div>
      <div id="joinGame">
        <input type="text" onChange={(e)=>(setConnectId(e.target.value))} />
        <button onClick={joinGame}>join</button>
      </div>
    </div>
    </>
  )
}
