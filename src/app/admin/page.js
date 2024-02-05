"use client"

import {useEffect, useState} from 'react';
import User from './componements/User.js';
import Products from './componements/Products.js';
import Orders from './componements/Orders.js';


export default function Admin({}){

    let [state, setState] = useState("menu");

    let sessionId = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    let email = localStorage.getItem('email');
    let userRole = localStorage.getItem('userRole');
    let commands = ["User", "Products", "Orders"];

    return (
        <section className="flex justify-center items-center flex-col w-4/5 phone:w-11/12">
            <div className=" w-full flex items-center justify-around">
                <span>logged in as <span className="font-bold">{userRole} =&gt; {email}</span></span>
                <button className="bg-white text-black p-2 m-2 rounded hover:scale-110" onClick={() => {logout()} }>Logout</button>
            </div>

            <StateSelecter state={state} commands={commands} setState={setState}/>

        </section>
    )
}

function StateSelecter({state,commands,setState}){
    switch(state){
        case "User":
            return <User setState={setState}/>
        case "Products":
            return <Products setState={setState}/>
        case "Orders":
            return <Orders setState={setState}/>
        case "Admin":
            return <Adminpage setState={setState}/>
        default:
            return <Menu commands={commands} setState={setState} />
    }
}

function Menu ({commands,setState}) {

    return (
        <section className="flex flex-wrap justify-center items-center text-black">
            {commands.map((command, index) => {
                return <Box key={index} command={command} setState={setState}/>
            })}
        </section>
    )
}

function Box({command,setState}){
    return (
        <button className="Box w-40 h-40 phone:w-full rounded m-2 p-2 bg-white flex justify-center items-center" onClick={()=>{setState(command)}}>{command}</button>
    )
}

let logout = async () => {

    let token = localStorage.getItem('sessionId') || '';
    console.log("Token =>"+token);
    let response = await fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    let data = await response.json();
    if(data.success){
        localStorage.setItem('sessionId','');
        localStorage.setItem('userId','');
        localStorage.setItem('email','');
        localStorage.setItem('userRole','');
        location.reload();
    }else{
        alert("Error logging out")
    }
}