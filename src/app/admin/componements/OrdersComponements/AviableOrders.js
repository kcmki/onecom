import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";


export default function AviableOrders({setSelectedOrder,aviableOrders, setAviableOrders}){
    const [loading, setLoading] = useState(false);
    const [shown, setShown] = useState(false);
    const [message, setMessage] = useState("");
    const isLogged = useContext(LoggedContext);  
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
                if (data.message === "Not authorized"){
                    isLogged(false);
                }
            }else{
                setAviableOrders(data.orders);
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
                                <span className='hover:scale-110 select-none	'>Aviable orders list</span> 
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
                <table className="w-full rounded text-center">
                    <thead className='font-bold bg-black text-white'>
                        <tr>
                            <th>Order id</th>
                            <th>Order date</th>
                            <th>Total price  </th>
                            <th>Adress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aviableOrders.map((order,index) => {
                            let date = new Date(order.date);
                            date = date.toLocaleDateString();
                            return (
                                <tr key={index} className='border-y border-black' onClick={()=>{setSelectedOrder(order)}}>
                                    <td>{order.orderId}</td>
                                    <td>{ date }</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.adress}</td>
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