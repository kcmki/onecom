"use client"

import {useEffect, useState} from 'react';
import {Oval} from 'react-loader-spinner';
import Login from './login.js';


export default function AdminLayout({
    children,
  }) {

    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkLoggin = async () => {
            let token = localStorage.getItem('sessionId') || '';
            console.log("Token =>"+token);
            let response = await fetch('/api/isLogged/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let data = await response.json();
            console.log(data);
            if(data.success){
                console.log("Logged in as " + data.user.newSessionId)
                localStorage.setItem('sessionId',data.user.newSessionId)
                localStorage.setItem('userId',data.user.userId)
                localStorage.setItem('email',data.user.email)
                localStorage.setItem('userRole',data.user.userRole)
                setLogged(true)
            }else{
                localStorage.setItem('sessionId','')
                console.log("Not logged in" + data.message)
                setLogged(false)
            }
            setLoading(false);
        }
        if (localStorage.getItem('sessionId') !== null && localStorage.getItem('sessionId') !== undefined && localStorage.getItem('sessionId') !== '' ){
            checkLoggin();
        } else {
            setLoading(false);
        }
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
        <section className="w-full h-full flex justify-center items-center ">
          {children}
        </section>
        )
    }

    return (
        <Login setLogged={setLogged}/>
    )
  }