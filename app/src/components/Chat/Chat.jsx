import {React, useState, useContext} from 'react'
import "./Chat.css"
import { GameContext } from '../../App'

export default function Chat({handleMsgSend,chat,msg,setMsg}) {
    const gameInfo = useContext(GameContext)

  return (
    <>
        <div id="chat-div">
            <div id="msgs-div">
            {chat.map((msgInfo,i)=>{
                                console.log(msgInfo.userName)
                                console.log(`userName${(msgInfo.userName==gameInfo.name)?gameInfo.turn:Number(!gameInfo.turn)}`,msgInfo.msg)
                                return (
                                    <div className="msg-div" key={i}>
                                        <span id={`userName${(msgInfo.userName==gameInfo.name)?gameInfo.turn:Number(!gameInfo.turn)}`}>{msgInfo.userName} :</span>
                                        <span id="msg">{msgInfo.msg}</span>
                                    </div>
                                )
                            })
            }
            </div>
            <form id="msg-form" onSubmit={(e)=>handleMsgSend(e)}>
                <input id="msg-input" placeholder="  send a message" value={msg} type="text" onChange={(e)=>setMsg(e.target.value)}/>
                <button id="msg-send-btn" onClick={(e)=>handleMsgSend(e)}>Send</button>
            </form>
        </div>
    </>
  )
}
