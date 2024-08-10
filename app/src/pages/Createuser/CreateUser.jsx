import React,{useContext, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./CreateUser.css"
import { GameContext, SocketContext } from '../../App';
import { backendURL } from '../../config/backendURL';


export default function CreateUser() {

    const socket = useContext(SocketContext);
    const gameInfo = useContext(GameContext);
    const navigate = useNavigate();

    const [userName,setUserName]  =  useState("");

    const [errorMsg,setErrorMsg] = useState("");

    const handleCreateUser = async ()=>{
        console.log(socket.id)
        if(userName==""){
            setErrorMsg("enter a username");
            return;
        }
        await axios.post(backendURL+"/clearPlayer",{socketId:socket.id})
        const res = await axios.post(backendURL+"/createUser",{userName:userName,socketId:socket.id});
        console.log(res);
        if(res.data.status==0){
            gameInfo.name = userName
            navigate("/Home");
        }
        else{
            console.log(res.data.msg)
            setErrorMsg(res.data.msg);
        }
    }
  return (
    <>
        <div >
        <div className="Title">
         <h1>Tic Tac Toe</h1>
        </div>
            <div id="creation-div">
                <h3 id="creation-instruction">please enter your name below</h3>
                <input id="username-input" type="text" onChange={(e)=>setUserName(e.target.value)} />
                <div id="creation-btn-div">
                    <button id="creation-btn" onClick={handleCreateUser}>Create</button>
                </div>
                <h2>{errorMsg}</h2>
                </div>
        </div>
    </>
  )
}
