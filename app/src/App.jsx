import { createContext, useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import { Routes,Route } from 'react-router-dom'
import {io} from 'socket.io-client';
import Lobby from './pages/Lobby/Lobby';
import GamePage from './pages/GamePage/GamePage';
import CreateUser from './pages/Createuser/CreateUser';

const socket = io("https://psychic-doodle-vxr44vj9jj4fp4r4-8080.app.github.dev/");

export const GameContext = createContext(null);
const gameInfo = {name:"",inGame:false,roomId:null,turn:null,inLobby:false}
           

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
      </Routes>
      </SocketContext.Provider>
      </GameContext.Provider>
    </>
  )
}

export default App
