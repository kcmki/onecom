import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";


export default function OrdersList({setSelectedOrder}){
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [shown, setShown] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        
        let getOrders = async () => {
            setLoading(true)
            let response = await fetch('/api/orders/aviable/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('sessionId')
                }
            });
            if (response.status != 200) {
                setLoading(false)
                setMessage('Error : '+response.message);
            }
            let data = await response.json();
            if (data.success === false){
                setMessage('Error : '+data.message);
            }else{
                setOrders(data.orders);
                setMessage("");
            }
            setLoading(false)
        }
        getOrders();
        },[shown]);


    if (loading) return (
                        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >
                            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                                <span className='hover:scale-110 select-none	'>Orders list</span> 
                                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
                            </h1>
                            <div className='flex justify-center align-center m-4'>
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
    return(
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >
            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                <span className='hover:scale-110 select-none	'>Aviable orders list</span> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="flex justify-center align-center m-4">
                <table className="w-full rounded">
                    <thead className='font-bold bg-black text-white'>
                        <tr>
                            <th>Order id</th>
                            <th>Order date</th>
                            <th>Order status</th>
                            <th>User incharge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order,index) => {
                            return (
                                <tr key={index} onClick={()=>{setSelectedOrder(order)}}>
                                    <td>{order._id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.status}</td>
                                    <td>{order.user}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center align-center m-4">
                {message}
            </div>
        </div>
        )

}