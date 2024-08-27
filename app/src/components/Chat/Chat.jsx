import {React, useState} from 'react'
import "./Chat.css"

export default function Chat({handleMsgSend,chat,msg,setMsg}) {

  return (
    <>
        <div id="chat-div">
            <div id="msgs-div">
            {chat.map((msgInfo,i)=>{
                                return (
                                    <div className="msg-div" key={i}>
                                        <span id="userName">{msgInfo.userName} :</span>
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
