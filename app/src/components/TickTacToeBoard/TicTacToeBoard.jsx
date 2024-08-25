import React, { useContext, useEffect, useState } from 'react'
import "./TicTacToeBoard.css"
import { Socket } from 'socket.io-client';
import { GameContext, SocketContext } from '../../App';
import { useNavigate } from 'react-router-dom';



export default function TicTacBoard({Title,board,outputMsg,updateBoard,resetGame,handleLeavingGame}) {
   
    return(
        <>
        <div className="lobbymain">
        <div id="Title-div">
            <h2 id="Title">{Title}</h2>
        </div>
        <div className="board">
            <div className="cell" id="1" onClick={()=>updateBoard(0)}>{board[0]}</div>
            <div className="cell" id="2" onClick={()=>updateBoard(1)}>{board[1]}</div>
            <div className="cell" id="3" onClick={()=>updateBoard(2)}>{board[2]}</div>
            <div className="cell" id="4" onClick={()=>updateBoard(3)}>{board[3]}</div>
            <div className="cell" id="5" onClick={()=>updateBoard(4)}>{board[4]}</div>
            <div className="cell" id="6" onClick={()=>updateBoard(5)}>{board[5]}</div>
            <div className="cell" id="7" onClick={()=>updateBoard(6)}>{board[6]}</div>
            <div className="cell" id="8" onClick={()=>updateBoard(7)}>{board[7]}</div>
            <div className="cell" id="9" onClick={()=>updateBoard(8)}>{board[8]}</div>
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
