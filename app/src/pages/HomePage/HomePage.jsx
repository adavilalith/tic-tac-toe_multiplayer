import React,{useState, useEffect, useContext} from 'react';
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { GameContext, SocketContext } from '../../App';
import axios from 'axios';

export default function HomePage() {
  const navigate = useNavigate()
  const [connectId,setConnectId] = useState()
  const socket = useContext(SocketContext)
  const gameInfo = useContext(GameContext)

  useEffect(()=>{
    if(gameInfo.name==""){
      navigate('/')
    }
    else{
      //clean user info on server side
    }
  },[])

  const createGame=async ()=>{
    console.log("creating game");
    const res = await axios.post("https://psychic-doodle-vxr44vj9jj4fp4r4-8080.app.github.dev/createGame",{socketId:socket.id})
    socket.emit("createGame",res.data.roomId)
    gameInfo.roomId=res.data.roomId
    gameInfo.inGame=true
    gameInfo.turn=0
    navigate('/Lobby');
  }

  const joinGame=()=>{
    socket.emit("joinGame",connectId)
    socket.on("gameStart",(msg)=>{
      console.log(msg)
      if(msg=="success"){
        console.log("lets play")
        gameInfo.inGame=true
        gameInfo.roomId=connectId
        gameInfo.turn=1;
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
