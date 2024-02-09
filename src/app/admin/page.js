"use client"

import {useEffect, useState,useContext} from 'react';
import User from './componements/User.js';
import Products from './componements/Products.js';
import Orders from './componements/Orders.js';
import {Oval} from 'react-loader-spinner';
import {LoggedContext} from './layout.js';

export default function Admin({}){
    
    const [state, setState] = useState("menu");
    const [loggingOut, setLoggingOut] = useState(false);
    let email = localStorage.getItem('email');
    let name = localStorage.getItem('name');
    let role = localStorage.getItem('userRole');
    let adminCommands = ["User", "Products", "Orders"];
    let userCommands = ["User","Orders"];
    const setLogged = useContext(LoggedContext);
    return (
        <section className="flex justify-center items-center flex-col w-4/5 phone:w-11/12">
            <div className=" w-full flex items-center justify-around">
                <span>logged in as <span className="font-bold">{name} =&gt; {email}</span></span>
                <button className="bg-white text-black p-2 m-2 rounded hover:scale-110 w-32 flex justify-center items-center" onClick={() => {logout(setLoggingOut,setLogged)} }>
                    {loggingOut ? <Oval
                        visible={true}
                        height="20"
                        width="20"
                        color="#000"
                        secondaryColor="#000"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        />  : "Logout"}
                    </button>
            </div>

            <StateSelecter state={state} commands={role=="admin"?adminCommands:userCommands} setState={setState}/>

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

let logout = async (setLoggingOut,setLogged) => {
    setLoggingOut(true);
    
    let token = localStorage.getItem('sessionId') || '';
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
        setLogged(false);
    }else{
        alert("Error logging out")
    }
    setLoggingOut(false);
}