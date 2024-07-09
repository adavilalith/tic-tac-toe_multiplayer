import React,{useState, useEffect, useContext} from 'react';
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { GameContext, SocketContext } from '../../App';
import axios from 'axios';

export default function HomePage() {
  const navigate = useNavigate()
  const [connectId,setConnectId] = useState()
  const [players,setPlayers] = useState({})
  const socket = useContext(SocketContext)
  const gameInfo = useContext(GameContext)

    

  useEffect(()=>{
    if(gameInfo.name==""){
      navigate('/')
    }
    else{
      //clean user info on server side
      socket.emit("leaveGame",socket.id)
      axios.post("https://psychic-doodle-vxr44vj9jj4fp4r4-8080.app.github.dev/resetUser",{socketId:socket.id})
      socket.on("getPlayers",(players)=>{
        console.log(players)
        players=JSON.parse(players)
        gameInfo.inGame=false
        gameInfo.turn=null
        gameInfo.roomId=null
        setPlayers(players)
      })
    }
    // setPlayers({1:{name:"asfasfaf",inGame:false},2:{name:"bthtsd",inGame:false},3:{name:"csdgsd",inGame:true}})
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
        <button id="create-game-btn" onClick={createGame}>create game</button>
      </div>
      <div id="joinGame">
        <input type="text" onChange={(e)=>(setConnectId(e.target.value))} />
        <button id="game-join-btn" onClick={joinGame}>join</button>
      </div>
      <div id="players">
        <h2>Players Online{":  "+Object.keys(players).length}</h2>
        <div id="player-list">
          <div className="player-name-div">
            <div className={`player-inGame-${gameInfo.inGame}`}></div>
            <p className="player-name-text">{gameInfo.name+" (You)"}</p>
          </div>
        {
          Object.keys(players).map((p,i)=>{
            if(p!=socket.id){
              return(
                <div className="player-name-div" key={i}>
                  <p className={`player-inGame-${players[p].inGame}`}></p>
                  <p className="player-name-text">{players[p].name}</p>
                  {/* <button className="player-duel-btn">Duel</button> */}
                </div>
              ) 
            }
          }
          )
        }
        </div>
      </div>
    </div>
    </>
  )
}
