import { createContext, useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import { Routes,Route } from 'react-router-dom'
import {io} from 'socket.io-client';
import Lobby from './pages/Lobby/Lobby';
import GamePage from './pages/GamePage/GamePage';
import CreateUser from './pages/Createuser/CreateUser';
import PlayWithBotLobby from './pages/PlayWithBotLobby/PlayWithBotLobby';
import { backendURL } from './config/backendURL';

const socket = io(backendURL);

export const GameContext = createContext(null);
const gameInfo = {name:"",inGame:false,roomId:null,turn:null,inLobby:false,duelOpen:false}
           

export const SocketContext = createContext(null)

function App() {
  useEffect(()=>{
    socket.on("hello",(msg)=>{
    console.log(msg)
    console.log(socket.id)
    })

  },[])
  return (
    <>
      <GameContext.Provider value={gameInfo}>
      <SocketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<CreateUser/>}></Route>
        <Route path="/Home" element={<HomePage/>}></Route>
        <Route path="/Lobby" element={<Lobby/>}></Route>
        <Route path="/GamePage" element={<GamePage/>}></Route>
        <Route path="/PlayWithBotLobby" element={<PlayWithBotLobby/>}></Route>
      </Routes>
      </SocketContext.Provider>
      </GameContext.Provider>
    </>
  )
}

export default App
