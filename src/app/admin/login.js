import { getHash } from 'next/dist/server/image-optimizer';
import {useRef} from 'react';




export default function Login({setLogged}){
    
    const refEmail = useRef();
    const refPassword = useRef();
    

    let getLogin = async () => {
        // call api to login
        let email = refEmail.current.value;

        let password = refPassword.current.value;

        console.log(email, password)
        try{
            let response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email, password: password})
            });
            let data = await response.json();

            if(data.success){
                setLogged(true)
            }
            else
                throw new Error('Login failed :' + data.message);

        }catch(e){
            alert("Error: " + e.message + "\nPlease try again.")
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            Enter your credentials

            <form action={getLogin} className="flex flex-col w-1/2">

                <input ref={refEmail} className="text-black" type="email" name="email" placeholder="Email" required />
                <input ref={refPassword} className="text-black" type="password" name="password" placeholder="Password" required />
                <button type="submit" >Login</button>

            </form>
        </div>
    )
}