import GoBack from "./goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate} from './utils.js';
import { Oval } from 'react-loader-spinner';
import UserStats from "./userComponements/UserStats";
import UpdateUser from "./userComponements/UserUpdate";
import SiteUpdate from "./adminComponements/SiteUpdate";
import AddUser from "./adminComponements/AddUser";


export default function User({setState}){

    const setLogged = useContext(LoggedContext);
    const [loading, setLoading] = useState(true);
    //check if logged in 
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
        <div className="flex flex-col justify-center items-center w-full">
            <GoBack setState={setState}/>
            <UserPower />

            {
                localStorage.getItem('userRole') === 'admin' ? <AdminPower /> : null
            }
        </div>
    )
}

function UserPower(){

    return(
        <>
            <UserStats />
            <UpdateUser />
        </>
    )
}

function AdminPower(){
    return(
        <>
            <SiteUpdate />
            <AddUser />

            <div className="p-2 m-2 w-full bg-white text-black rounded-xl">
                <h1 className="text-2xl text-center">Delete user (with password)</h1>
            </div>
        </>
    )
}