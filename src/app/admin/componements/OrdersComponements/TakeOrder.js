import GoBack from "../goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import {AuthUpdate} from '../../../../utils.js';
import { Oval } from 'react-loader-spinner';


export default function TakeOrder({selectedOrder, setSelectedOrder,setCurrentOrders,setAviableOrders}){
    const setLogged = useContext(LoggedContext);
    const [message, setMessage] = useState("");
    const ClearOrder = () => {
        setSelectedOrder(undefined)
    }
    const TakeOrder = async () => {
        let token = localStorage.getItem('sessionId');
        let data = {orderId:selectedOrder.orderId};
        fetch('/api/orders/take/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            if (data.success === false){
                setMessage('Error : '+data.message);
                if (data.message === "Not authorized"){
                    setLogged(false);
                }
            }else{
                setMessage('Order taken');
                setAviableOrders((current)=>{return current.filter((order)=>{if (order.orderId !== selectedOrder.orderId) return order})});
                setSelectedOrder(undefined);
                setCurrentOrders((current)=>[...current,selectedOrder]);
            }
        })
    }

    if(!selectedOrder) return(
        <div className="flex flex-col justify-center items-center bg-white text-black rounded-xl m-2 p-2 w-full">
            <h1 className="text-xl font-bold">Select Order</h1>
            <p>No order selected</p>
        </div>)

    return(
        <div className="flex flex-col justify-center items-center bg-white text-black rounded-xl m-2 p-2 w-full">
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-xl font-bold">Select Order</h1>
                <Order selectedOrder={selectedOrder} setMessage={setMessage}/>
            </div>

            <div className="m-1 p-1 w-full flex justify-center items-center">
                <span className="font-bold m-1 p-1 w-full text-center">{message}</span>
            </div>
            <div className="w-full flex flex-wrap justify-around">
                <button className="bg-black text-white font-bold p-1 m-1 rounded hover:scale-110" onClick={()=>{TakeOrder()}}>Take order</button>
                <button className="bg-black text-white font-bold p-1 m-1 rounded hover:scale-110" onClick={()=>{ClearOrder()}}>Clear</button>
            </div>
        </div>
    )

}


export function Order({selectedOrder,setMessage}){

    const [loading, setLoading] = useState(true);
    

    const [data, setData] = useState(null);

    useEffect(() => {
        let getProducts = async () => {
            setLoading(true)
            let response = await fetch('/api/products/order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('sessionId')
                },
                body: JSON.stringify({products:selectedOrder.products})
            });
            if (response.status != 200) {
                setLoading(false)
                setData([]);
                setMessage('Error loading : '+response.message);
            }
            let data = await response.json();
            if (data.success === false){
                setMessage('Error de chargement des produits : '+data.message);
                setData([]);
                if (data.message === "Not authorized"){
                    isLogged(false);
                }
            }else{
                setData(data.orders);
                setMessage("");
            }
            setLoading(false)
        }
        if(selectedOrder)
            getProducts();
        },[selectedOrder]);

    return(
    <div className="flex justify-center items-center w-full h-72 my-2 flex-warp">
        <div className="m-1 p-1 border-2 border-black rounded flex flex-col text-break w-4/12 h-full">
            <span className="font-bold m-1 p-1 w-full text-center">Client info</span>
            <span className="m-1 p-1"> <span className="font-bold">Name :</span> {selectedOrder.clientName}</span>
            <span className="m-1 p-1"><span className="font-bold">Phone :</span> {selectedOrder.clientPhone}</span>
            <span className="m-1 p-1"><span className="font-bold">Adress :</span> {selectedOrder.clientAdress}</span>
            <span className="m-1 p-1"><span className="font-bold">Wilaya :</span> {selectedOrder.clientWilaya}</span>
        </div>
        <div className="m-1 p-1 rounded w-8/12 h-full overflow-y-auto overflow-x-hidden flex flex-col items-center">
            <span className="font-bold m-1 p-1 w-full text-center flex justify-center items-center flex-col">Products info</span>
            {
                (loading) ? <Oval
                visible={true}
                height="100"
                width="100"
                color="#000000"
                secondaryColor="#000000"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                /> :data.map((product, index) => (
                    <div key={index} className="m-1 p-1 border-2 border-black rounded flex justify-center items-center">
                        <img src={product.img} alt={product.name} className="w-10 h-10 rounded"/>
                        <div className="flex flex-wrap">
                            <span className="m-1"><span className="font-bold">Name :</span> {product.name}</span>
                            <span className="m-1"><span className="font-bold">Price :</span> {product.price}</span>
                            <span className="m-1"><span className="font-bold">Quantity :</span> {product.quantity}</span>
                            <span className="m-1"><span className="font-bold">size :</span> {product.size}</span>
                        </div>
                    </div>
                ))
            }
        </div>

    </div>
    )
}
