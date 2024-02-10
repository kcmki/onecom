import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp,MdOutlineUploadFile} from "react-icons/md";
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';


export default function ListUsers({setState}){
    const [dataLoading, setDataLoading] = useState(false);
    const [shown, setShown] = useState(false);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        let fetchUserList = async () => {
            setDataLoading(true);

            let resp = await fetch('/api/user/list/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "bearer "+localStorage.getItem('sessionId')
                }})

            let data = await resp.json();
            if (data.success){
                setUsers(data.users);
            }else{
                setMessage(data.message);
            }
            setDataLoading(false);
        }
        fetchUserList()
    },[]);

    if (dataLoading) return (
        <div className={"p-2 m-2 w-full bg-white flex flex-col justify-start items-center text-black rounded-xl overflow-hidden duration-500 transition"+ (shown ?"":" h-12 ")} >

            <h1 className="text-2xl text-center flex justify-around items-center h-8 w-full" onClick={()=>{setShown(!shown)}}> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
            <span className='hover:scale-110 select-none'>Users list</span> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="my-4">
            <Oval
            visible={true}
            height="100"
            width="100"
            color="#000"
            secondaryColor="#000"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />
            </div>
        </div>
    )
    if( users.length === 0) return (
     <div className={"p-2 m-2 w-full bg-white flex flex-col justify-start items-center text-black rounded-xl overflow-hidden duration-500 transition"+ (shown ?"":" h-12 ")} >

        <h1 className="text-2xl text-center flex justify-around items-center h-8 w-full" onClick={()=>{setShown(!shown)}}> 
        { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
        <span className='hover:scale-110 select-none'>Users list</span> 
        { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
        </h1>
        <div className="my-4">
            <h1>No users loaded</h1>
        </div>
        <div className="col-span-2 flex justify-center items-center">
            <h1>{message}</h1>
        </div>
    </div>
    )
    return (
        <div className={"p-2 m-2 w-full bg-white flex flex-col justify-start items-center text-black rounded-xl overflow-hidden duration-500 transition"+ (shown ?"":" h-12 ")} >

            <h1 className="text-2xl text-center flex justify-around items-center h-8 w-full" onClick={()=>{setShown(!shown)}}> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
            <span className='hover:scale-110 select-none'>Users list</span> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="my-4 flex flex-col align-center justify-start">
                {users.map((user, index) => {

                    return (
                    <div key={index} className="flex justify-center items-center w-full p-2 w-8/12">
                        <h1>{user.name}</h1>
                        <h1>{user.email}</h1>
                    </div>
                    )
                    
                    })}
            </div>
            

            <div className="col-span-2 flex justify-center items-center">
                <h1>{message}</h1>
            </div>

        </div>
    )
}