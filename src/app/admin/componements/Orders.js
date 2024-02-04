import GoBack from "./goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate} from './utils.js';
import { Oval } from 'react-loader-spinner';

export default function Orders({setState}){
    
    const setLogged = useContext(LoggedContext);
    const [loading, setLoading] = useState(true);
    //check if logged in and update token
    useEffect(() => {
        if (localStorage.getItem('sessionId') !== null && localStorage.getItem('sessionId') !== undefined && localStorage.getItem('sessionId') !== '' ){
            AuthUpdate(setLogged,setLoading);
        } else {
            setLoading(false);
        }
    },[]);

    if (loading) return (<div className='flex justify-center align-center '>
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
                        </div>)
    
    return (
        <div className="flex flex-col justify-center items-center">
            <GoBack setState={setState}/>
            ORDER PAGE
        </div>
    )
}