import React, { useContext, useEffect, useState } from 'react'
import TicTacToeBoard from "../../components/TickTacToeBoard/TicTaToecBoard"
import { GameContext, SocketContext } from '../../App';
import { useNavigate } from 'react-router-dom';


export default function GamePage() {
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
          navigate("/Home")
      }
      socket.on("gameTurn",(res)=>{
          res=JSON.parse(res)
          if(res.status==0){
              setBoard(res.board)
          }
          else if (res.status==20){
              console.log("game interrupted")
              navigate("/Home")
          }
      })
  },[])
  
  const updateBoard = (cell)=>{
      console.log(cell)
      socket.emit("gameTurn",cell)
      socket.on("gameTurn",(res)=>{
          res = JSON.parse(res);
          if (res.status==20){
              console.log("game interrupted")
              navigate("/Home")
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
      navigate("/Home")
  }

  const resetGame = ()=>{
      socket.emit("resetGame")
  }

  
  return (
    <div>
      <TicTacToeBoard 
                      board={board}
                      outputMsg={outputMsg}
                      updateBoard={updateBoard}
                      resetGame={resetGame}
                      handleLeavingGame={handleLeavingGame}
      ></TicTacToeBoard>
    </div>
  )
}
