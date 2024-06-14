import { createContext, useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import { Routes,Route } from 'react-router-dom'
import {io} from 'socket.io-client';
import Lobby from './pages/Lobby/Lobby';
import GamePage from './pages/GamePage/GamePage';

const socket = io("https://animated-engine-q79v69wgr9vhxx9j-3000.app.github.dev/");

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
      <SocketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/Lobby" element={<Lobby/>}></Route>
        <Route path="/GamePage" element={<GamePage/>}></Route>
      </Routes>
      </SocketContext.Provider>
    </>
  )
}

export default App
