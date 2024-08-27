import React, { useContext, useEffect, useState } from 'react'
import "./TicTacToeBoard.css"

export default function TicTacBoard({Title,board,outputMsg,updateBoard,resetGame,handleLeavingGame}) {
   
    return(
        <>
        <div className="lobbymain">
        <div className='Title'>
            <h2 >{Title}</h2>
        </div>
        <div className="board">
            <div className={`cell ${board[0]}`} id="1" onClick={()=>updateBoard(0)}>{board[0]}</div>
            <div className={`cell ${board[1]}`} id="2" onClick={()=>updateBoard(1)}>{board[1]}</div>
            <div className={`cell ${board[2]}`} id="3" onClick={()=>updateBoard(2)}>{board[2]}</div>
            <div className={`cell ${board[3]}`} id="4" onClick={()=>updateBoard(3)}>{board[3]}</div>
            <div className={`cell ${board[4]}`} id="5" onClick={()=>updateBoard(4)}>{board[4]}</div>
            <div className={`cell ${board[5]}`} id="6" onClick={()=>updateBoard(5)}>{board[5]}</div>
            <div className={`cell ${board[6]}`} id="7" onClick={()=>updateBoard(6)}>{board[6]}</div>
            <div className={`cell ${board[7]}`} id="8" onClick={()=>updateBoard(7)}>{board[7]}</div>
            <div className={`cell ${board[8]}`} id="9" onClick={()=>updateBoard(8)}>{board[8]}</div>
        </div>
        <div>
            <div id="outputMsg-div">
                <p id="outputMsg">
                {outputMsg}
                </p>
            </div>
            <div id="reset-btn-div">
                <button id="reset-btn" onClick={resetGame}>reset</button>
            </div>
            <div id="exit-btn-div">
                <button id="exit-btn" onClick={handleLeavingGame}>exit</button>
            </div>
            </div>
        </div>
        </>
    )
}
