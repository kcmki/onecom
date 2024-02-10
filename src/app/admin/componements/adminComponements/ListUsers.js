import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp,MdOutlineUploadFile} from "react-icons/md";
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';


export default function ListUsers({setState}){
    const [dataLoading, setDataLoading] = useState(false);
    const [shown, setShown] = useState(false);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState({});
    const [deleting, setDeleting] = useState(false);
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
    },[shown]);

    let handleDelete = async () => {
        //check password
        setDeleting(true)
        let password = document.querySelector('#userDeletingPassword').value;
        if (password === ''){
            setMessage('Password is required');
            setDeleting(false)
            return;
        }
        if (selectedUser == {} || selectedUser === undefined){
            setMessage('No user selected');
            setDeleting(false)
            return;
        }
        let resp = await fetch('/api/user/delete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "bearer "+localStorage.getItem('sessionId')
            },
            body: JSON.stringify({userId: selectedUser.userId, password: hash(password)})
        })
        if (resp.status != 200){
            setMessage('Error');
            setDeleting(false)
            return;
        }
        let data = await resp.json();
        if (data.success){
            setMessage(data.message);
            setUsers((current)=>{return current.filter((user)=>{return user.userId !== selectedUser.userId})})
        }else{
            setMessage(data.message);
        }
        setDeleting(false)
    }

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
            <div className="my-4 flex flex-col items-center justify-start w-full">
                {users.map((user, index) => {
                    let select = (user.userId === selectedUser.userId ? "bg-blue-200" : "")
                    return (
                    <div key={index} className={"flex justify-around items-center m-2 border border-black rounded p-2 w-9/12 "+select} onClick={()=>{setSelectedUser(user)}}>
                        <h1 className="font-bold" >{user.name}</h1>
                        <h1>{user.email}</h1>
                        <h1>{user.userRole}</h1>

                    </div>
                    )
                    })}
            </div>
            <div className="w-11/12 h-1 rounded bg-black"> </div>
            <div className="flex flex-col justify-center items-center m-2">
                <div className="">Selected user : <span className="font-bold">{selectedUser.name} =&gt; {selectedUser.email}</span></div>
                <input id="userDeletingPassword" type="password" placeholder="password" className="border border-black rounded m-1 p-1" />
                <button className="bg-black text-white font-bold m-1 p-1 px-4 rounded hover:scale-110" onClick={()=>{handleDelete()}}>
                    {deleting ? <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#FFF"
                            secondaryColor="#FFF"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            /> : "Delete"}
                </button>
            </div>

            

            <div className="col-span-2 flex justify-center items-center">
                <h1>{message}</h1>
            </div>

        </div>
    )
}

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}