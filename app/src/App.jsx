import { useEffect, useState } from 'react'
import {io} from 'socket.io-client'
import './App.css'
import TicTacBoard from './components/TickTacToeBoard/TicTacBoard'

function App() {
  const [connectId,setConnectId] = useState()

  const socket = io("https://animated-engine-q79v69wgr9vhxx9j-3000.app.github.dev/");
  useEffect(()=>{
    socket.on("hello",(msg)=>{
    console.log(msg)
    console.log(socket.id)
    })
  },[])

  const createGame=()=>{
    console.log("try create")
    socket.emit("createGame",socket.id)
  }

  const joinGame=()=>{
    socket.emit("joinGame",connectId)
    socket.on("joinGame",(msg)=>{
      if(msg=="success"){
        console.log("lets play")
      }
      else{
        console.log("room full")
      }
    })
  }
  return (
    <>
      <div className="Title">
        <h1>Tic Tac Toe</h1>
      </div>
      <TicTacBoard/>
      <button onClick={createGame}>create</button>
      <input type="text" onChange={(e)=>(setConnectId(e.target.value))} />
      <button onClick={joinGame}>join</button>
    </>
  )
}

export default App
