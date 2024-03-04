"use client"

import {useEffect, useState,useRef} from 'react'
import { Oval } from 'react-loader-spinner'
import ListCommandes from './listCommandes'

export default function Commandes(){

    let [Loading, setLoading] = useState(false)
    let [commandes, setCommandes] = useState([])
    let [message, setMessage] = useState('')
    let refNumber = useRef(null)

    let getCommandes = async () => {
        setLoading(true)
        let response = await fetch('/api/orders/clientOrders' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({number:Number(refNumber.current.value)})
        })
        if(response.status !== 200){
            setMessage('Erreur lors de la récupération des commandes')
        }
        let data = await response.json()
        if(data.success){
            setCommandes(data.orders)
        }else{
            setMessage(data.message)
        }
        setLoading(false)
    }  


    return(
        <div className='flex justify-center items-center w-full flex-col'>
            <div className='flex flex-col justify-center items-center '>
                <div className='flex justify-center items-center'>
                    <span className='font-bold'>Numero de telephone</span>
                    <input ref={refNumber} type="text" placeholder='Entrez votre numéro de téléphone' className='flex justify-center items-center p-2 rounded m-4 w-full border-2 bg-white text-black border-black dark:border-[#e5e7eb]'/>
                </div>
                <button onClick={getCommandes} className='flex justify-center items-center p-2 rounded-xl m-4 w-40 border-2 text-black bg-white font-bold border-black dark:border-[#e5e7eb]'>
                {
                    Loading ? 
                    <Oval visible={true} height="20" width="20" color="#000" secondaryColor="#000" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
                    : "mes commandes"
                }
                </button>
                <div className=''>{message}</div>
            </div>

            
            {
                Loading ? <Oval
                visible={true}
                height="100"
                width="100"
                color="#000"
                secondaryColor="#000"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
                : 
                <ListCommandes commandes={commandes} />
            }
            
        </div>
    )
}