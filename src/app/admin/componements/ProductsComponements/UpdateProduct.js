
import {useContext, useEffect, useState,useRef} from 'react';
import {LoggedContext} from '../../layout.js';
import {imageBase64} from '../../../../utils.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineUploadFile } from "react-icons/md";


export default function UpdateProduct({selectedProduct, setSelectedProduct, products, setProducts}){
    
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [upImages, setUpImages] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [Qsizes,setQsizes] = useState([]);

    const refName = useRef();
    const refPrice = useRef();
    const refSize = useRef();
    const refQuantity = useRef();
    const refDescription = useRef();
    const setLogged = useContext(LoggedContext);

    useEffect(() => {
        if (selectedProduct !== undefined){
            refName.current.value = selectedProduct.name;
            refPrice.current.value = selectedProduct.price;
            refDescription.current.value = selectedProduct.description;
            setQsizes(selectedProduct.Qsizes);
            setUpImages(selectedProduct.images);
        }
    },[selectedProduct]);

    if (selectedProduct === undefined) 
        return (
            <div className="flex flex-col justify-center items-center w-full my-2 p-2 bg-white rounded-xl">
            <h2 className="text-black p-2 font-bold text-xl">Update Product</h2>
            <span className="text-black p-2">No product selected</span>
        </div>
    )
    
    async function handleChooseUpImg(e){
        let file = e.target.files[0];
        const image = await imageBase64(file);
        setUpImages((current) =>[...current, image]);
    }

    const startUploading = async ()=>{
        setLoading(true);
        let data = {
            productId: selectedProduct.productId,
            name: refName.current.value,
            price: refPrice.current.value,
            description: refDescription.current.value,
            images: upImages,
            Qsizes: Qsizes
        }
        let response = await fetch("/api/products/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' +localStorage.getItem('sessionId')
            },
            body: JSON.stringify(data)
        });

        let res = await response.json();
        if(res.success){
            setMessage("Product updated successfully");
            setProducts(current => current.map((product)=>{if (selectedProduct != undefined && product != undefined){if(product.productId === selectedProduct.productId) return data; else return product}}));
            
        }else{
            setMessage("Product not updated Error : "+res.message);
            if(res.message === "Not authorized"){
                setLogged(false);
            }
        }
        setLoading(false);
    }

    const startDeleting = async ()=>{
        setDeleting(true);
        
        let data = {
            productId: selectedProduct.productId,
        }
        let response = await fetch("/api/products/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' +localStorage.getItem('sessionId')
            },
            body: JSON.stringify(data)
        });

        let res = await response.json();
        if(res.success){
            setMessage("Product deleted successfully");
            setProducts(current => current.map((product)=>{if (selectedProduct != undefined && product != undefined){if(product.productId != selectedProduct.productId) return product}}));
            setSelectedProduct(undefined);
        }else{
            setMessage("Product not deleted Error : "+res.message);
            if(res.message === "Not authorized"){
                setLogged(false);
            }
        }
        setDeleting(false);
    }

    const addQsize = ()=>{
        let s = refSize.current.value
        let q = refQuantity.current.value
        if(s === "" || q === "") 
            {setMessage("Size and quantity required");
            return}
        let elem = {size:s,quantity:q}
        setQsizes([...Qsizes,elem])
        setMessage("")
    }
    return (
        <div className="flex flex-col justify-center items-center w-full my-2 p-2 bg-white rounded-xl">
            <h2 className="text-black p-2 font-bold text-xl">Update Product</h2>

            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Name</span> 
                <input ref={refName} className="bg-black rounded p-1 m-1 w-8/12" type="text" placeholder="name" />
            </div>
            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Price</span> 
                <input ref={refPrice} className="bg-black rounded p-1 m-1 w-8/12" type="number" min={1} placeholder="price" />
            </div>
            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Description</span> 
                <input ref={refDescription} className="bg-black rounded p-1 m-1 w-8/12" type="text" placeholder="description"  />
            </div>

            <div className="flex small:flex-col justify-between small:justify-center flex-wrap items-center w-10/12">
                <div className="flex small:flex-col justify-between items-center w-full "> 
                    <span className="text-black font-bold">Size Quantity</span>
                    <div className='w-8/12 flex justify-between  m-1'>                    
                        <input ref={refSize} className="bg-black rounded p-1 w-5/12" type="text" placeholder="size" />
                        <input ref={refQuantity} className="bg-black rounded p-1 w-6/12 small:w-4/12" type="number" min={1} defaultValue={1} placeholder="quantity" />
                    </div> 
                </div>
                <div className="flex small:flex-col justify-center items-center w-full ">
                    <button className="bg-black text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center hover:scale-110" onClick={()=>{addQsize()}}>Add Size</button>
                </div>
            </div>

            <div className="grid grid-cols-3 border-2 border-black rounded m-2">
                {Qsizes.map((Qsize,index)=>{
                    return (
                        <div className="flex justify-center items-center flex-wrap bg-black text-white rounded m-1 p-1 hover:bg-red-600" key={index} onClick={()=>{setQsizes((current)=>{return current.filter((elem)=>{if(elem!=Qsize) return elem})})}}> 
                            <span className="text-white font-bold">{Qsize.size+" "}</span>
                            <span className="text-white font-bold"> : </span>
                            <span className="text-white font-bold">{" "+Qsize.quantity}pc</span>
                        </div>
                    )
                })
                }
            </div>
            <div className="flex flex-col justify-center items-center">
                <label htmlFor="upProdImage" className="bg-white border-black border-2 text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                    <MdOutlineUploadFile className="text-black" />
                </label>

                <input type="file" id="upProdImage" name="file" accept="image/*" className="hidden" onChange={handleChooseUpImg}/>

            </div>

            <div className="grid grid-cols-3 border-2 border-black text-black rounded m-2">
                {   upImages === undefined ? "No images" : 
                    upImages.map((image, index) => {
                        return (
                        <div className="w-32 h-32 bg-red-600 rounded m-1 flex justify-center items-center"> 
                            <img key={index} src={image} alt="product" className="w-32 h-32 rounded hover:w-28 hover:h-28" onClick={()=>{let im = upImages.filter((img)=>{if(img!=image) return img});setUpImages(im)}} />
                        </div>
                        )
                    })
                }
            </div>
 
            <button className="bg-black text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center hover:scale-110" onClick={startUploading}>
                {loading?<Oval 
                            visible={true}
                            color="#FFFFFF"
                            height="20"
                            width="20"
                            secondaryColor="#FFFFFF"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""/> : 'Update Product'}
            </button>
            <button className="bg-black text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center hover:scale-110" onClick={startDeleting}>
                {deleting?<Oval 
                            visible={true}
                            color="#FFFFFF"
                            height="20"
                            width="20"
                            secondaryColor="#FFFFFF"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""/> : 'Delete Product'}
            </button>
            <button className="bg-black text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center hover:scale-110" onClick={()=>{setSelectedProduct(undefined),setMessage("");}}>
                Clear
            </button>
            <span className="text-black">{message}</span>
        </div>
    )
}