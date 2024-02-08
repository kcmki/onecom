"use client"

import {useEffect, useState} from 'react';
import {Oval} from 'react-loader-spinner';
import Login from './componements/login.js';
import { createContext,useContext } from 'react';


export const LoggedContext = createContext(false);

export default function AdminLayout({
    children,
  }) {
    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkLoggin = async () => {
            let token = localStorage.getItem('sessionId') || '';
            console.log("Token =>"+token);
            let response = await fetch('/api/login/isLogged/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let data = await response.json();
            if(data.success){
                localStorage.setItem('sessionId',data.user.newSessionId)
                localStorage.setItem('userId',data.user.userId)
                localStorage.setItem('email',data.user.email)
                localStorage.setItem('userRole',data.user.userRole)
                setLogged(true)
            }else{
                localStorage.setItem('sessionId','')
                setLogged(false)
            }
            setLoading(false);
        }
        if ((localStorage.getItem('sessionId') !== null && localStorage.getItem('sessionId') !== undefined && localStorage.getItem('sessionId') !== '' ) ){
            checkLoggin();
        }
        setLoading(false);
    },[]);

    if(loading){
        return (
            <div className='flex justify-center align-center '>
                <Oval
                visible={true}
                height="100"
                width="100"
                color="#FFFFFF"
                secondaryColor="#FFFFFF"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
            </div>
        )
    }
    if(logged){
      return (
        <LoggedContext.Provider value={setLogged}>
            <section className="w-full h-full flex justify-center items-center ">
            {children}
            </section>
        </LoggedContext.Provider>
        )
    }

    return (
        <Login setLogged={setLogged}/>
    )
  }