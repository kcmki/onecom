

import {useContext, useEffect, useState,useRef} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';


export default function ListProducts({products, setProducts,setSelectedProduct}){

    
    const setLogged = useContext(LoggedContext);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let fetchProducts = async ()=>{
            let response = await fetch('/api/products/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
                }
            });
            let res = await response.json();
            if(res.success){
                setProducts(res.data);
            }else{
                if(res.message === "Not authorized"){
                    setLogged(false);
                }
                setMessage(res.message);
            }
            setLoading(false);
        }
        fetchProducts();
    },[]);

    if (loading) return (<div className='flex justify-center align-center w-full m-2 rounded-xl bg-white'>
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
                        </div>)

    if (products === undefined) return (
        <div className="flex flex-col justify-center items-center w-full small:w-full rounded-xl bg-white">
            <h2 className="text-black p-2 m-2 font-bold text-xl">List Products</h2>
            <span className="text-black p-2">Error loading products</span>
        </div>
    )
    if (products.length === 0) return (
        <div className="flex flex-col justify-center items-center w-full small:w-full rounded-xl bg-white">
            <h2 className="text-black p-2 m-2 font-bold text-xl">List Products</h2>
            <span className="text-black p-2">No products</span>
        </div>
    )
    return (
        <div className="flex flex-col justify-center items-center w-full rounded-xl bg-white px-2">
            <h2 className="text-black p-2 m-2 font-bold text-xl">List Products</h2>
            <span className="text-black">{message}</span>
            {
                products.map((product, index) => {
                    if (product === undefined) return;
                    return (
                        <ProductsCard key={index} product={product} setSelectedProduct={setSelectedProduct}/>
                    )
                })
            }
        </div>
    )
}

function ProductsCard({product,setSelectedProduct}){
    return (
        <div className="flex flex-col justify-center items-center w-full m-2 bg-white rounded-xl border-2 border-black " onClick={()=>{setSelectedProduct(product)}}>
            <div className="grid grid-cols-3 m-2">
                {
                    product.images.map((image, index) => {
                        return (
                            <img key={index} src={image} alt="product" className="w-24 h-24 rounded" />
                        )
                    })
                }
            </div>
            <h2 className="text-black p-2 m-2 font-bold text-xl">{product.name}</h2>
            <p className="text-black p-2 m-2 font-bold text-l">Price : {product.price}</p>
            <p className="text-black p-2 m-2 font-bold text-l">Description : {product.description}</p>
            <div className="grid grid-cols-3 border-2 border-black rounded m-2">
                {product.Qsizes.map((Qsize,index)=>{
                    return (
                        <div className="flex justify-center items-center flex-wrap bg-black text-white rounded m-1 p-1" key={index} > 
                            <span className="text-white font-bold">{Qsize.size+" "}</span>
                            <span className="text-white font-bold"> : </span>
                            <span className="text-white font-bold">{" "+Qsize.quantity}pc</span>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}