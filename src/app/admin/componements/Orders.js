import GoBack from "./goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate} from '../../../utils.js';
import { Oval } from 'react-loader-spinner';

import AviableOrders from './OrdersComponements/AviableOrders.js';
import TakeOrder from './OrdersComponements/TakeOrder.js';
import AllOrders from "./OrdersComponements/AllOrders";
import MyOrders from "./OrdersComponements/MyOrders";


export default function Orders({setState}){
    
    const setLogged = useContext(LoggedContext);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentOrders, setCurrentOrders] = useState([]);
    const [aviableOrders, setAviableOrders] = useState([]);

    let UserRole = localStorage.getItem('userRole');
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
        <div className="flex flex-col justify-center items-center w-full">
            <GoBack setState={setState}/>
            <AviableOrders setSelectedOrder={setSelectedOrder} aviableOrders={aviableOrders} setAviableOrders={setAviableOrders}/>
            <TakeOrder selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setCurrentOrders={setCurrentOrders} setAviableOrders={setAviableOrders}/>
            <MyOrders currentOrders={currentOrders}/>
            {
                (UserRole === "admin") ? <AllOrders /> : null
            }

        </div>
    )
}