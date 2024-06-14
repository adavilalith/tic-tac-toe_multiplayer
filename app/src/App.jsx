import { useState } from 'react'
import './App.css'
import TicTacBoard from './components/TickTacToeBoard/TicTacBoard'

function App() {

  return (
    <>
      <div className="Title">
        <h1>Tic Tac Toe</h1>
      </div>
      <TicTacBoard/>

    </>
  )
}

export default App
