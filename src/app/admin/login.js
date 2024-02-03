"use client"

import {useRef,useState} from 'react';
import {Oval} from 'react-loader-spinner';

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

export default function Login({setLogged}){
    
    const refEmail = useRef();
    const refPassword = useRef();
    const [loading, setLoading] = useState(false);

    let getLogin = async () => {
        setLoading(true);
        // call api to login
        let email = refEmail.current.value;
        let password = hash(refPassword.current.value);

        try{
            let response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, password: password})
            });
            let data = await response.json();

            if(data.success){
                localStorage.setItem('sessionId',data.sessionId)
                localStorage.setItem('userId',data.userId)
                localStorage.setItem('email',data.email)
                localStorage.setItem('userRole',data.userRole)
                setLogged(true)
            }
            else
                throw new Error('Login failed :' + data.message);

        }catch(e){
            alert("Error: " + e.message + "\nPlease try again.")
        }
        setLoading(false);
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1>
                Enter your credentials
            </h1>
            
            <form action={getLogin} className="flex flex-col justify-center items-center">

                <input ref={refEmail} className="text-black w-100 p-2 m-2 rounded" type="email" name="email" placeholder="Email" required />
                <input ref={refPassword} className="text-black w-100 p-2 m-2 rounded" type="password" name="password" placeholder="Password" required />
                <button type="submit" className='flex justify-center items-center rounded-xl w-40 p-2 m-2 bg-white text-black font-bold' > 
                    {
                        loading ?                     
                        <Oval
                        visible={true}
                        height="20"
                        width="20"
                        color="#FFFFFF"
                        secondaryColor="#FFFFFF"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        /> : "Login"
                    }
                </button>

            </form>
        </div>
    )
}