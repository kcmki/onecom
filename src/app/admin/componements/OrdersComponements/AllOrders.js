import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";



export default function AllOrders({setSelectedOrder}){
    const [shown, setShown] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const setLogged = useContext(LoggedContext);

    useEffect(()=>{
        let getMyOrders = async () => {
            setLoading(true);
            let response = await fetch('/api/orders/allorders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
                }})
            if (response.status !== 200) {setMessage("Error loading");setOrders([]);setLoading(false); return};
            let data = await response.json();
            if (data.success === false){
                setMessage("Error loading");
                setOrders([]);
                if(data.message === "Not authorized") {setLogged(false); return};
                setLoading(false);
                return;
            }
            setOrders(data.orders);
            setLoading(false);
            setMessage("");
        }
        getMyOrders();
        },[shown])

        let sortPrice = () => {
            setOrders((current)=>[...current].sort((a,b)=>a.totalPrice - b.totalPrice));
            }
        let sortDate = () => {
            setOrders((current)=>[...current].sort((a,b)=>a.date - b.date));
            }
        let sortStatus = () => {
            setOrders((current)=>[...current].sort((a,b)=>{
                const statusOrder = ['Pending', 'On delivery', 'Delivered', 'Canceled'];
                return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            }));
            }

    return (
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >
            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                <span className='hover:scale-110 select-none	'>All orders</span> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            {
                orders.length === 0 ? 
                <div className='flex justify-center align-center m-4'>
                    No orders
                </div>
                :
                    
                        loading ?
                        <div className='flex justify-center align-center m-4'>
                            <Oval
                            visible={true}
                            height="100"
                            width="100"
                            color="#000000"
                            secondaryColor="#000000"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            />
                        </div>
                        :
                        (<table className="w-full rounded text-center my-4">
                        <thead className='font-bold bg-black text-white'>
                            <tr>
                                <th>Order id</th>
                                <th onClick={()=>{sortDate()}} >Order date</th>
                                <th onClick={()=>{sortPrice()}}>Total price  </th>
                                <th onClick={()=>{sortStatus()}}>Order status</th>
                                <th>User incharge</th>
                                <th>Lock status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order,index) => {
                                let date = new Date(order.date);
                                date = date.toLocaleDateString();
                                return (
                                    <tr key={index} className='border-y border-black' >
                                        <td>Order {order.orderId}</td>
                                        <td>{ date }</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.status}</td>
                                        <td>{order.userName}</td>
                                        <td>{order.lock ? "Locked" : "Unlocked"}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        </table>)
                
            }
            <div className='w-full p-2 flex justify-center'>
                <span className=' bg-red-600 rounded '>{message}</span>
            </div>
        </div>
    )
}