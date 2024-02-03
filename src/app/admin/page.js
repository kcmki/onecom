"use client"

import {useEffect, useState} from 'react';

export default function Admin({}){

    let sessionId = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    let email = localStorage.getItem('email');
    let userRole = localStorage.getItem('userRole');
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

    let commands = ["User", "Products", "Orders"]
    return (
        <section className="flex justify-center items-center flex-col">
            <div className=" w-full flex items-center justify-around">
                <span>logged in as <span className="font-bold">{userRole} =&gt; {email}</span></span>
                <button className="bg-white text-black p-2 m-2 rounded" onClick={() => {logout()} }>Logout</button>
            </div>

            <div className="flex justify-start items-center flex-wrap text-black p-2 m-10">
                {
                    commands.map((command,key) => {
                        return (
                            <Box command={command} key={key}/>
                        )
                    })
                }
            </div>

        </section>

    )
}

function Box({command}){
    return (
        <a className="Box w-40 h-40 phone:w-full rounded m-2 p-2 bg-white flex justify-center items-center" href={"/admin/"+command}>{command}</a>
    )
}

