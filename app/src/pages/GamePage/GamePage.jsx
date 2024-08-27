import React, { useContext, useEffect, useState } from 'react'
import TicTacToeBoard from "../../components/TickTacToeBoard/TicTacToeBoard"
import Chat from '../../components/Chat/Chat';
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
  const [outputMsg,setOutputMsg] = useState("");
  const [chat,setChat] = useState([])
  const [msg,setMsg] = useState("")

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
  socket.on("gameChat",(msgInfo)=>{
    msgInfo = JSON.parse(msgInfo)
    let temp = [...chat]
    temp.push(msgInfo)
    setChat(temp)
  })

  const handleMsgSend = (e)=>{
    e.preventDefault();
    socket.emit("gameChat",msg)
    setMsg("")
  }
  
  return (
    <div>
      <TicTacToeBoard 
                      Title={"Player vs Player"}
                      board={board}
                      outputMsg={outputMsg}
                      updateBoard={updateBoard}
                      resetGame={resetGame}
                      handleLeavingGame={handleLeavingGame}
      ></TicTacToeBoard>
      <Chat handleMsgSend={handleMsgSend} chat={chat} msg={msg} setMsg={setMsg}></Chat>
    </div>
  )
}
