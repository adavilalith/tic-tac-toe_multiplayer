import React, { useContext, useEffect, useState } from 'react'
import "./TicTacBoard.css"
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../App';

export default function TicTacBoard({roomId,player}) {
    const socket = useContext(SocketContext)
    const [board,setBoard] = useState([" "," "," ",
                                       " "," "," ",
                                       " "," "," ",
                                      ]);
    const [turn,setTurn] = useState(0);
    const [outputMsg,setOutputMsg] = useState("");
    const [running,setRunning] = useState(true);

    const updateBoard = (cell)=>{
        let tempBoard = [...board]
        if(!running){
            setRunning(true);
            setBoard([" "," "," ",
                " "," "," ",
                " "," "," ",
               ]);
            setOutputMsg("")
            return;
        }

        

        if(tempBoard[cell]!=" "){
            setOutputMsg("Incorrect move try again!");
            return;
        }
        if(turn%2==player){
            tempBoard[cell] = (player==1)?"X":"O";
            socket.emit("turn",String(cell)+"@"+roomId)
        }
        else{
            socket.on("turn",(move)=>{
                tempBoard[Number(move)]=(player==1)?"O":"X";
            })
        }
        setTurn(turn+1)
        setBoard(tempBoard);
        setOutputMsg("")
        checkWinner(tempBoard)

    }

    const checkWinner = (tempBoard)=>{
        console.log("checking")
        const winCond = [[0,1,2],
                         [3,4,5],
                         [6,7,8],
                         [0,3,6],
                         [1,4,7],
                         [2,5,8],
                         [0,4,8],
                         [2,4,6],
                        ]
        for(let cond=0;cond<8;cond++){
            let Xwin=true;
            let Owin=true;
            for(let i=0;i<3;i++){
                if(tempBoard[winCond[cond][i]]!="X"){
                    Xwin=false;
                    break;
                }
            }
            for(let i=0;i<3;i++){
                if(tempBoard[winCond[cond][i]]!="O"){
                    Owin=false;
                    break;
                }
            }
            if(Xwin){
                setRunning(false);
                setOutputMsg("X is the winner");
                return;
            }
            if(Owin){
                setOutputMsg("O is the winner");
                setRunning(false);
                return;    
            }
            let fullCond=true
            for(let i=0;i<9;i++){
                if(tempBoard[i]==" "){
                    fullCond=false;
                    break;
                }
            }
            if(fullCond){
                setOutputMsg("Tie");
                setRunning(false);
            }
            
        }
    }

    return (
        <>
        <div className="main" >
        <div><h1>{roomId}</h1></div>
        <div><h1>{(player==1)?"X":"O"}</h1></div>
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
