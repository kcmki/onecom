import GoBack from "../goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import {AuthUpdate} from '../../../../utils.js';
import { Oval } from 'react-loader-spinner';


export default function TakeOrder({selectedOrder, setSelectedOrder}){

    return(
        <div className="flex flex-col justify-center items-center bg-white text-black rounded-xl m-2 p-2 w-full">
            <div className="flex flex-col justify-center items-center ">
                <h1>Select Order</h1>
                { selectedOrder ? selectedOrder._id:"No order selected"}
            </div>
        </div>
    )

}