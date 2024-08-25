import {React,useEffect,useState,useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { GameContext, SocketContext } from '../../App';
import TicTacToeBoard from '../../components/TickTacToeBoard/TicTaToecBoard';

export default function BotGamePage() {
    const socket = useContext(SocketContext)
    const gameInfo = useContext(GameContext)
    const navigate = useNavigate()

    const [board,setBoard] = useState([" "," "," ",
        " "," "," ",
        " "," "," ",
       ]);
    const [turn,setTurn] = useState(0);
    const [outputMsg,setOutputMsg] = useState("");
    const [running,setRunning] = useState(true);
    
    const updateBoard = (cell)=>{

    }

    const resetGame = ()=>{

    }

    const handleLeavingGame = ()=>{

    }


    useEffect(()=>{
        if(!gameInfo.inGame||!socket.id){
          navigate("/Home")
        }
      },[])
    
  return (
          <TicTacToeBoard 
                      board={board}
                      outputMsg={outputMsg}
                      updateBoard={updateBoard}
                      resetGame={resetGame}
                      handleLeavingGame={handleLeavingGame}
      ></TicTacToeBoard>
  )
}
