
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

export default function UpdateUser(){
    let elements = [["name","text"],["email","text"],["new password","password"],["confirm password","password"],["separator","separator"],["password","password"]];
    
    const [shown, setShown] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");
    let setLogged = useContext(LoggedContext);
    const updateUser = async () => {
        let data = {};
        setMessage("");
        setUpdating(true);
        elements.map((element,key) => {
            if (element[0] != "separator")
            {let val = document.getElementById("updateUser "+key).value
            data[element[0]] = val}
        })
        if (data["password"] == "" ) {
            setMessage("Please enter your current password");
            setUpdating(false);
            return;
        }
        if (data["new password"] != data["confirm password"]) {
            setMessage("Different passwords");
            setUpdating(false);
            return;
        }
        data["new password"] = (data["new password"] != "") ?hash(data["new password"]):""
        data["password"] = hash(data["password"]);

        let response = await fetch('/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
            },
            body: JSON.stringify(data)
        })
        if (response.status != 200){
            setMessage('Error');
            setUpdating(false)
            return;
        }
        response = await response.json();
        if (response.success) {
            setMessage("User updated");
            sessionStorage.setItem('sessionId',response.sessionId);
            sessionStorage.setItem("email",response.email);
            sessionStorage.setItem("name",response.name);
        }else{
            if(response.message === "Not authorized") setLogged(false);
            setMessage(response.message);
        }
        setUpdating(false);
    }

    return (
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >
            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                <span className='hover:scale-110 select-none	'>Update user</span> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="flex flex-col justify-center items-center">
                {
                    elements.map((element,key) => {
                        if (element[0] === "separator") return <div key={key} className="w-11/12 h-1 bg-black rounded"></div>
                        return(
                            <div className="flex text-black w-10/12 justify-between items-center small:flex-col " key={key}>
                                <label htmlFor={"updateUser"+key} className="w-40 font-bold small:text-center">{element[0]}</label>
                                <input id={"updateUser "+key} type={element[1]} className="border-2 border-black m-2 p-1 rounded w-9/12" placeholder={element[0]} />
                            </div>
                        )
                    })
                }
                <button className="border-2 border-black m-2 p-2 py-1 font-bold rounded bg-black text-white flex justify-center items-center w-20 hover:scale-110" onClick={()=>{updateUser()}}>
                    {updating ? <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#fff"
                            secondaryColor="#fff"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            />
                    
                    : "Update"}
                </button>
                <div className="w-11/12 text-black rounded text-center">{message}</div>
            </div>
        </div>
    )
}