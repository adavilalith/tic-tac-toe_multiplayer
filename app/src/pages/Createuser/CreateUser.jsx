import React,{useContext, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./CreateUser.css"
import { GameContext, SocketContext } from '../../App';

export default function CreateUser() {

    const socket = useContext(SocketContext);
    const gameInfo = useContext(GameContext);
    const navigate = useNavigate();

    const [userName,setUserName]  =  useState("");

    const [errorMsg,setErrorMsg] = useState("");

    const handleCreateUser = async ()=>{
        console.log(socket.id)
        await axios.post("https://psychic-doodle-vxr44vj9jj4fp4r4-8080.app.github.dev/clearPlayer",{socketId:socket.id})
        const res =await axios.post("https://psychic-doodle-vxr44vj9jj4fp4r4-8080.app.github.dev/createUser",{userName:userName,socketId:socket.id});
        console.log(res);
        if(res.data.status==0){
            gameInfo.name = userName
            navigate("/Home");
        }
        else{
            console.log(res.data.msg)
            setErrorMsg(res.data.msg);
            setTimeout(setErrorMsg(""),30000)
        }
    }
  return (
    <>
        <div id="main">
        <div>
            <h1 id="title">Tic Tac Toe</h1>
        </div>
            <div id="creation-div">
                <h3 id="creation-instruction">please enter you name below</h3>
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
