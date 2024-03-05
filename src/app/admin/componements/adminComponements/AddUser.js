import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp,MdOutlineUploadFile} from "react-icons/md";
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';


export default function AddUser(){
    let elements = [["name","text"],["email","text"],["new password","password"],["confirm password","password"],["userRole",["admin","user"]],["separator","separator"],["password","password"]];

    const [shown, setShown] = useState(false);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState("");

    let AddUser = async () => {
        setAdding(true);
        let data = {};
        // load and check data 
        elements.map((element,key) => {
            if (element[0] != "separator")
            data[element[0]] = document.getElementById("addUser "+key).value;
        })
        if (data["name"] === "" || data["email"] === "" || data["new password"] === "" || data["confirm password"] === "" || data["password"] === ""){
            setMessage("All fields are required");
            setAdding(false);
            return;
        }
        if (data["new password"] !== data["confirm password"]){
            setMessage("Passwords don't match");
            setAdding(false);
            return;
        }
        data["password"] = hash(data["password"]);
        data["new password"] = hash(data["new password"]);

        let response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('sessionId')
            },
            body: JSON.stringify(data),
        })
        if (response.status != 200){
            setMessage('Error');
            setAdding(false)
            return;
        }
        let res = await response.json();
        if (res.success){
            setMessage("User added");
        } else {
            setMessage(res.message);
        }
        setAdding(false);
    }
    return(
        <div className={"border-2 border-black dark:border-[#e5e7eb] p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >

            <h1 className="text-2xl text-center flex justify-around items-center h-8" onClick={()=>{setShown(!shown)}}> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
            <span className='hover:scale-110 select-none'>Add user</span> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="flex flex-col justify-center items-center">
                {
                    elements.map((element,key) => {
                        if (element[0] === "separator") return <div key={key} className="w-11/12 h-1 bg-black rounded"></div>
                        if (element[0] === "userRole") return(
                            <div className="flex text-black w-10/12 justify-between items-center small:flex-col " key={key}>
                                <label htmlFor={"addUser"+key} className="w-40 font-bold small:text-center">{element[0]}</label>
                                <select id={"addUser "+key} className="border-2 border-black m-2 p-1 rounded w-9/12">
                                    {
                                        element[1].map((option, key) => {
                                            return <option key={key} value={option}>{option}</option>
                                        })
                                    }
                                </select>
                            </div>
                        )
                        return(
                            <div className="flex text-black w-10/12 justify-between items-center small:flex-col " key={key}>
                                <label htmlFor={"addUser"+key} className="w-40 font-bold small:text-center">{element[0]}</label>
                                <input id={"addUser "+key} type={element[1]} className="border-2 border-black m-2 p-1 rounded w-9/12" placeholder={element[0]} />
                            </div>
                        )
                    })
                }
                <button className="border-2 border-black m-2 p-2 py-1 font-bold rounded bg-black text-white flex justify-center items-center w-20 hover:scale-110" onClick={()=>{AddUser()}}>
                    {adding ? <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#fff"
                            secondaryColor="#fff"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            />
                    
                    : "Add user"}
                </button>
                <div className="w-11/12 text-black rounded text-center">{message}</div>
            </div>
        </div>
    )
}

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}