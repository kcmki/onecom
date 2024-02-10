import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp} from "react-icons/md";


export default function AllOrders({setSelectedOrder}){
    const [shown, setShown] = useState(false);

    return (
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >
            <h1 className="text-2xl text-center flex justify-around items-center" onClick={()=>{setShown(!shown)}}> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
                <span className='hover:scale-110 select-none	'>All orders</span> 
                { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>

        </div>
    )
}