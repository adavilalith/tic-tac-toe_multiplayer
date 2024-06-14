import { useState } from 'react'
import './App.css'

function App() {

  return (
    <>
      <div className="Title">
        <h1>Tic Tac Toe</h1>
      </div>
      <div className="board">
        <div className="cell" id="1">x</div>
        <div className="cell" id="2">x</div>
        <div className="cell" id="3">x</div>
        <div className="cell" id="4">x</div>
        <div className="cell" id="5">x</div>
        <div className="cell" id="6">x</div>
        <div className="cell" id="7">x</div>
        <div className="cell" id="8">x</div>
        <div className="cell" id="9">x</div>
      </div>
    </>
  )
}

export default App
