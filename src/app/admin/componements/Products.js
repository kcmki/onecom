
import GoBack from "./goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate,imageBase64} from './utils.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineUploadFile } from "react-icons/md";

export default function Products({setState}){

    const setLogged = useContext(LoggedContext);
    const [loading, setLoading] = useState(true);
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
        <div className="flex flex-col justify-center items-center">
            <GoBack setState={setState}/>
            Products
            <AddProduct />
            <ListProducts />
        </div>
    )
}

function AddProduct(){
    const [message, setMessage] = useState("");
    const [loading, setloading] = useState(false);
    const [images, setImages] = useState([]);

    async function handleUploadImg(e){
        let file = e.target.files[0];
        const image = await imageBase64(file);
        setImages([...images, image]);
    }

    return (
        <div className="flex flex-col justify-center items-center w-full m-2 p-2 bg-white rounded-xl">
            <h2 className="text-black p-2 m-2 font-bold text-xl">Add Product</h2>

            <input className="bg-black rounded p-1 m-1" type="text" placeholder="name" />
            <input className="bg-black rounded p-1 m-1" type="number" placeholder="price" />
            <input className="bg-black rounded p-1 m-1" type="number" placeholder="quantity" />
            <input className="bg-black rounded p-1 m-1" type="text" placeholder="description"  />
            <div className="flex flex-col justify-center items-center">
                <label htmlFor="file" className="bg-white border-black border-2 text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                    <MdOutlineUploadFile className="text-black" />
                </label>

                <input type="file" id="file" name="file" accept="image/*" className="hidden" onChange={handleUploadImg}/>

            </div>
            <div className="grid grid-cols-3 border-2 border-black">
                {
                    images.map((image, index) => {
                        return (
                        <div className="w-32 h-32 bg-red-600 rounded m-1 flex justify-center items-center"> 
                            <img key={index} src={image} alt="product" className="w-32 h-32 rounded hover:w-28 hover:h-28" onClick={()=>{let im = images.filter((img)=>{if(img!=image) return img});setImages(im)}} />
                        </div>
                        )
                    })
                }
            </div>

            <button className="bg-black text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                {loading?<Oval 
                            visible={true}
                            color="#FFFFFF"
                            height="20"
                            width="20"
                            secondaryColor="#FFFFFF"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""/> : 'Add Product'}
            </button>
            <span>{message}</span>
        </div>
    )
}

function ListProducts(){

    let products = fetch("");

    return (
        <div className="flex flex-col justify-center items-center w-full">

        </div>
    )
}