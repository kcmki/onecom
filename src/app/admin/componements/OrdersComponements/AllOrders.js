import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";


export default function AllOrders({setSelectedOrder}){
    const [shown, setShown] = useState(false);
    const [orders, setOrders] = useState([]);
    return (
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >
            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                <span className='hover:scale-110 select-none	'>All orders</span> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>

            <table className="w-full rounded text-center my-4">
                    <thead className='font-bold bg-black text-white'>
                        <tr>
                            <th>Order id</th>
                            <th>Order date</th>
                            <th>Total price  </th>
                            <th>Order status</th>
                            <th>User incharge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order,index) => {
                            let date = new Date(order.date);
                            date = date.toLocaleDateString();
                            return (
                                <tr key={index} className='border-y border-black' onClick={()=>{setSelectedOrder(order)}}>
                                    <td>{order.id}</td>
                                    <td>{ date }</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.status}</td>
                                    <td>{order.user}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
        </div>
    )
}