
import GoBack from "./goBack"
import {useContext, useEffect, useState,useRef} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate,imageBase64} from '../../../utils.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineUploadFile } from "react-icons/md";
import { Underdog } from "next/font/google";
import AddProduct from "./ProductsComponements/AddProduct";
import ListProducts from "./ProductsComponements/ListProducts";
import UpdateProduct from "./ProductsComponements/UpdateProduct";
export default function Products({setState}){

    const [products, setProducts] = useState([]);
    const setLogged = useContext(LoggedContext);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(undefined);

    //check if logged in 
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
        <div className="flex flex-wrap justify-center items-start w-full">
            <GoBack setState={setState}/>

            <div className="flex flex-col w-1/2 small:w-full">
                <AddProduct setProducts={setProducts} />
                <UpdateProduct selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} products={products} setProducts={setProducts} />
            </div>
            <div className="w-1/2 small:w-full p-2 small:p-0">
                <ListProducts products={products} setProducts={setProducts} setSelectedProduct={setSelectedProduct}/>
            </div>
            
        </div>
    )
}


