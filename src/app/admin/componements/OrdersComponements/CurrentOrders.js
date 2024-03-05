import {useContext, useEffect, useState,useRef} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";
import { Order } from './TakeOrder.js';

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

export default function CurrentOrders({currentOrders,setCurrentOrders,setAviableOrders}){
    const [shown, setShown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(undefined);
    const statusRef = useRef();
    const lockPassword = useRef();
    const setLogged = useContext(LoggedContext);
    useEffect(()=>{
    let getMyOrders = async () => {
        setLoading(true);
        let response = await fetch('/api/orders/myorders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
            }})
        if (response.status !== 200) {setMessage("Error loading");setLoading(false); return};
        let data = await response.json();
        if (data.success === false){
            setMessage("Error loading");
            if(data.message === "Not authorized") {setLogged(false); return};
            setLoading(false);
            return;
        }
        setCurrentOrders(data.orders);
        setLoading(false);
    }
    getMyOrders();
    },[shown])

    let makeAviable = async (setMessage) => {
        let response = await fetch('/api/orders/myorders/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
            },
            body: JSON.stringify({orderId:selectedOrder.orderId})
        })
        if (response.status !== 200) {setMessage("Error loading"); return};
        let data = await response.json();
        if (data.success === false){
            setMessage("Error loading");
            if(data.message === "Not authorized") {setLogged(false); return};
            return;
        }
        setAviableOrders((current)=>[...current,selectedOrder]);
        setCurrentOrders((current)=>current.filter((order)=>order.orderId !== selectedOrder.orderId));
        setSelectedOrder(undefined);
        setMessage("")
        }

    let StatusChange = async (setMessage,text) => {
        let response = await fetch('/api/orders/status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
            },  
            body: JSON.stringify({orderId:selectedOrder.orderId,status:text})
        })
        if (response.status !== 200) {setMessage("Error loading"); return};
        let data = await response.json();
        if (data.success === false){
            setMessage("Error loading");
            if(data.message === "Not authorized") {setLogged(false); return};
            return;
        }
        //change order status locally
        setCurrentOrders((current)=>current.filter((order)=>{
            if(order.orderId === selectedOrder.orderId){
                order.status = text;
            }
            return order;
        }))
        statusRef.current.innerText = text;
        setMessage("")
        return;
        }
    let LockOrder = async (setMessage) => {
        let response = await fetch('/api/orders/lock/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
            },
            body: JSON.stringify({orderId:selectedOrder.orderId,password:hash(lockPassword.current.value)})
        })
        if (response.status !== 200) {setMessage("Error loading"); return};
        let data = await response.json();
        if (data.success === false){
            setMessage("Error loading" + data.message);
            if(data.message === "Not authorized") {setLogged(false); return};
            return;
        }
        //change order status locally
        setCurrentOrders((current)=>current.filter((order)=>{
            if(order.orderId === selectedOrder.orderId){
                order.status = "Locked";
            }
            return order;
        }))
        statusRef.current.innerText = "Locked"; 
        setMessage("")
    }
    if(currentOrders.length === 0) return(
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition border-2 border-black dark:border-[#e5e7eb]  "+ (shown ?"":" h-12 ")} >
            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                <span className='hover:scale-110 select-none'>Current order</span> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="flex flex-col justify-center items-center w-full m-2">

                <p>No orders taken</p>
                <p>{message}</p>
            </div>
        </div>
        )

    let sortPrice = () => {
        setCurrentOrders((current)=>[...current].sort((a,b)=>a.totalPrice - b.totalPrice));
        }
    let sortDate = () => {
        setCurrentOrders((current)=>[...current].sort((a,b)=>a.date - b.date));
        }
    let sortWilaya = () => {
        setCurrentOrders((current)=>[...current].sort((a,b)=>a.clientWilaya.localeCompare( b.clientWilaya)));
        }
    let sortStatus = () => {
        setCurrentOrders((current)=>[...current].sort((a,b)=>{
            const statusOrder = ['Pending', 'On delivery', 'Delivered', 'Canceled'];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }));
        }

    return(
    <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition border-2 border-black dark:border-[#e5e7eb]  "+ (shown ?"":" h-12 ")} >
        <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
            <span className='hover:scale-110 select-none'>Current orders</span> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
        </h1>

        <div className="flex flex-col justify-center items-center w-full m-2">
            {
                loading ? <Oval visible={true} height="100" width="100" color="#000000" secondaryColor="#000000" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" /> :
                (   
                    <table className="w-11/12 bg-white rounded table-fixed">
                        <thead>
                            <tr className='font-bold text-white bg-black border-black'>
                                <th>Order</th>
                                <th onClick={()=>{sortPrice()}}>Price</th>
                                <th onClick={()=>{sortDate()}}>Date</th>
                                <th onClick={()=>{sortWilaya()}} >Wilaya</th>
                                <th onClick={()=>{sortStatus()}}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order)=>{
                                let date = new Date(order.date);
                                date = date.toLocaleDateString();
                                return(
                                    <tr key={order.orderId} className='text-center hover:bg-gray-300 border-y border-black' onClick={()=>{setSelectedOrder(order)}}>
                                        <td>Order {order.orderId}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{date}</td>
                                        <td>{order.clientWilaya}</td>
                                        <td>{order.status}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )
            }
        </div>

        <div className="flex flex-col justify-center items-center w-full m-2">
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-xl">Order status</h1>
            </div>
            {
                selectedOrder == undefined ? <p>No order selected</p> : <Order selectedOrder={selectedOrder} setMessage={setMessage}/>
            }
        </div>

        <div className="m-1 p-1 w-full flex justify-center items-center">
            <span className="font-bold m-1 w-full text-center bg-red-600 rounded">{message}</span>
        </div>

        {
            selectedOrder == undefined ? "":
            (<div className='flex flex-wrap w-full justify-around items-center small:flex-col'>
                <div className="m-1 p-1 w-full flex justify-center items-center">
                   <span className='font-bold mx-2'> Status : </span>  <span ref={statusRef}> {selectedOrder.status}</span>
                </div>
                <div className="m-1 p-1 w-40 flex justify-center items-center">
                    <LoadingButton fonction={makeAviable} text={"set Aviable"} setMessage={setMessage}/>
                </div>

                <div className="flex justify-center items-center border border-black rounded m-2 small:flex-col">
                    <div className="m-1 p-1 w-28 flex justify-center items-center">
                        <LoadingButton fonction={StatusChange} text={"Pending"} setMessage={setMessage} />
                    </div>
                    <div className="m-1 p-1 w-28 flex justify-center items-center">
                        <LoadingButton fonction={StatusChange} text={"On delivery"} setMessage={setMessage} />
                    </div>
                    <div className="m-1 p-1 w-28 flex justify-center items-center">
                        <LoadingButton fonction={StatusChange} text={"Delivered"} setMessage={setMessage} />
                    </div>
                    <div className="m-1 p-1 w-28 flex justify-center items-center">
                        <LoadingButton fonction={StatusChange} text={"Canceled"} setMessage={setMessage} />
                    </div>
                </div>

                <div className="m-1 p-1 w-40 flex justify-center items-center">
                    <input ref={lockPassword} type="password" className="w-40 h-10 p-1 m-1 border border-black rounded" placeholder="Enter password" />
                    <LoadingButton fonction={LockOrder} text={"Lock"} setMessage={setMessage} />
                </div>
            </div>
            )
        }
    </div>
    )
}

function LoadingButton({fonction,text,setMessage}){
    const [loading, setLoading] = useState(false);
    const Click = async () => {
        setLoading(true);
        await fonction(setMessage,text);
        setLoading(false);
    }
    return(
        <button className="m-1 p-1 px-2 w-40 h-10 font-bold bg-black text-white rounded flex justify-center items-center border-2 border-black dark:border-[#e5e7eb]  " onClick={()=>{Click()}}>
            {loading ? <Oval visible={true} 
                            height="20" 
                            width="20" 
                            color="#FFF" 
                            secondaryColor="#FFF" 
                            ariaLabel="oval-loading" 
                            wrapperStyle={{}} 
                            wrapperClass="" />
                        : text}
        </button>
    )
}