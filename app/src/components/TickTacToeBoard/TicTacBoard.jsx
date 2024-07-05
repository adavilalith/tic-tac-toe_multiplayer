import React, { useContext, useEffect, useState } from 'react'
import "./TicTacBoard.css"
import { Socket } from 'socket.io-client';
import { GameContext, SocketContext } from '../../App';

export default function TicTacBoard() {
    const socket = useContext(SocketContext)
    const gameInfo = useContext(GameContext)
    const roomId = gameInfo.roomId
    const [board,setBoard] = useState([" "," "," ",
                                       " "," "," ",
                                       " "," "," ",
                                      ]);
    const [turn,setTurn] = useState(0);
    const [outputMsg,setOutputMsg] = useState("");
    const [running,setRunning] = useState(true);
    
    useEffect(()=>{
        socket.on("gameTurn",(res)=>{
            res=JSON.parse(res)
            if(res.status==0){
                setBoard(res.board)
            }
        })
    },[])
    
    const updateBoard = (cell)=>{
        socket.emit("gameTurn",cell)
        socket.on("gameTurn",(res)=>{
            res = JSON.parse(res);
            if(res.status==10){
                setOutputMsg(res.outputMsg)
            }
            else if(res.status==1){
                setBoard(res.board)
                setOutputMsg(res.outputMsg)
            }
            else{
                setBoard(res.board)
                setOutputMsg(res.outputMsg)

            }
        })
    }

    return (
        <>
        <div className="main" >
        <div><h1>Room Id:{roomId}</h1></div>
        <div><h1>Player:{gameInfo.name}</h1></div>
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
        </div>
        <div id="outputMsg">
            <h1>
        {outputMsg}

            </h1>
        </div>
        
        </>
    )
}
