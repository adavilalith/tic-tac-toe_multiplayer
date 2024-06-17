import React, { useContext, useEffect, useState } from 'react'
import TicTacToeBoard from "../../components/TickTacToeBoard/TicTacBoard"
import { GameContext, SocketContext } from '../../App'

export default function GamePage() {
  const [player,setPlayer]=useState()
  const [roomId,setRoomId]=useState()
  const socket = useContext(SocketContext)
  const gameInfo = useContext(GameContext)

  
  return (
    <div>
      <TicTacToeBoard roomId={gameInfo.roomId}></TicTacToeBoard>
    </div>
  )
}
