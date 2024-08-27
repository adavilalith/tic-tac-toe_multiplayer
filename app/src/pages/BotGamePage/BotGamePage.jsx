import {React,useEffect,useState,useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { GameContext, SocketContext } from '../../App';
import TicTacToeBoard from '../../components/TickTacToeBoard/TicTacToeBoard';

export default function BotGamePage() {
  useEffect(()=>{
    if(!gameInfo.inGame){
      
      navigate("/Home")
    }
  },[])

    const socket = useContext(SocketContext)
    const gameInfo = useContext(GameContext)
    const navigate = useNavigate()

    const [board,setBoard] = useState([" "," "," ",
        " "," "," ",
        " "," "," ",
       ]);
    const [turn,setTurn] = useState(0);
    const [outputMsg,setOutputMsg] = useState("");
    
    const updateBoard = (cell)=>{
        socket.emit("botGameTurn",cell);
        socket.on("botGameTurn",(res)=>{
          res = JSON.parse(res);
          if(res.status==20){
            navigate("/Home")
          }
          else if(res.status==-1){
            setBoard(res.board)
            setOutputMsg(res.msg)
          }
          else if(res.status==0){
            setOutputMsg("")
            setBoard(res.board)
          }
          else if(res.status==1){
            setBoard(res.board)
            setOutputMsg(res.msg)
          }
          else if(res.status==2){
            setBoard(res.board)
            setOutputMsg(res.msg)  
          }
          else if(res.status==10){
            setOutputMsg(res.msg)
          }
        })
    }

    const resetGame = ()=>{
      socket.emit("resetBotGame")
      setBoard([" ", " ", " ", " ", " ", " ", " ", " ", " "])
      setOutputMsg("")
    }

    const handleLeavingGame = ()=>{
      navigate("/Home")
    }


   
  return (
          <div>
            <TicTacToeBoard 
                      Title={"Player vs Bot"}
                      board={board}
                      outputMsg={outputMsg}
                      updateBoard={updateBoard}
                      resetGame={resetGame}
                      handleLeavingGame={handleLeavingGame}
            ></TicTacToeBoard>
          </div>
  )
}
