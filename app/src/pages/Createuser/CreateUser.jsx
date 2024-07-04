import React,{useContext, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./CreateUser.css"
import { SocketContext } from '../../App';

export default function CreateUser() {

    const socket = useContext(SocketContext);

    const navigate = useNavigate();

    const [userName,setUserName]  =  useState("");

    const [errorMsg,setErrorMsg] = useState("");

    const handleCreateUser = async ()=>{
        console.log(userName)
        const res =await axios.post("https://psychic-doodle-vxr44vj9jj4fp4r4-8080.app.github.dev/createUser",{userName:userName,socketId:socket.id});
        console.log(res);
        if(res.data.status==0){
            navigate("/Home");
        }
        else{
            console.log(res.data.msg)
            setErrorMsg(res.data.msg);
            await setTimeout(setErrorMsg(""),30000)
        }
    }
  return (
    <>
        <div id="main">
        <div>CreateUser</div>
        <input type="text" onChange={(e)=>setUserName(e.target.value)} />
        <button onClick={handleCreateUser}>Create</button>
        <h2>{errorMsg}</h2>
        </div>
    </>
  )
}
