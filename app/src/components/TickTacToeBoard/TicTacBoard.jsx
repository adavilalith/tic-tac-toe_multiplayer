import React, { useContext, useEffect, useState } from 'react'
import "./TicTacBoard.css"
import { Socket } from 'socket.io-client';
import { GameContext, SocketContext } from '../../App';
import { useNavigate } from 'react-router-dom';



export default function TicTacBoard() {
    const socket = useContext(SocketContext)
    const gameInfo = useContext(GameContext)
    const roomId = gameInfo.roomId
    const navigate = useNavigate();
    const [board,setBoard] = useState([" "," "," ",
                                       " "," "," ",
                                       " "," "," ",
                                      ]);
    const [turn,setTurn] = useState(0);
    const [outputMsg,setOutputMsg] = useState("");
    const [running,setRunning] = useState(true);
    useEffect(()=>{
        if(gameInfo.inGame==false){
            navigate("/home")
        }
        socket.on("gameTurn",(res)=>{
            res=JSON.parse(res)
            if(res.status==0){
                setBoard(res.board)
            }
            else if (res.status==20){
                console.log("game interrupted")
                navigate("/home")
            }
        })
    },[])
    
    const updateBoard = (cell)=>{
        socket.emit("gameTurn",cell)
        socket.on("gameTurn",(res)=>{
            res = JSON.parse(res);
            if (res.status==20){
                console.log("game interrupted")
                navigate("/home")
            }
            else if(res.status==10){
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

    const handleLeavingGame = ()=>{
        navigate("/home")
    }

    const resetGame = ()=>{
        socket.emit("resetGame")
    }

    return(
        <>
        <div className="lobbymain">
        <div id="roomId-div">
            <h3 id="roomId">Room Id : {roomId}</h3>
            </div>
        <div id="player-name-div">
            <h3 id="player-name">Player : {gameInfo.name}</h3>
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
