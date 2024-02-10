
import GoBack from "./goBack"
import {useContext, useEffect, useState,useRef} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate,imageBase64} from '../../../utils.js';
import { Oval } from 'react-loader-spinner';
import { MdOutlineUploadFile } from "react-icons/md";
import { Underdog } from "next/font/google";

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

function AddProduct({setProducts}){
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    const refName = useRef();
    const refPrice = useRef();
    const refQuantity = useRef();
    const refDescription = useRef();
    const setLogged = useContext(LoggedContext);
    async function handleChooseImg(e){
        let file = e.target.files[0];
        const image = await imageBase64(file);
        setImages([...images, image]);
    }

    const startUploading = async ()=>{
        setLoading(true);
        
        let data = {
            name: refName.current.value,
            price: refPrice.current.value,
            quantity: refQuantity.current.value,
            description: refDescription.current.value,
            images: images
        }

        let response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' +localStorage.getItem('sessionId')
            },
            body: JSON.stringify(data)
        });

        let res = await response.json();
        if(res.success){
            setMessage("Product added successfully");
            data.productId = res.id;
            setProducts(current => [...current, data]);
        }else{
            setMessage("Product not added Error : "+res.message);
            if(res.message === "Not authorized"){
                setLogged(false);
            }
        }
        setLoading(false);
    }
    return (
        <div className="flex flex-col justify-center items-center w-full my-2 p-2 bg-white rounded-xl">

            <h2 className="text-black p-2 font-bold text-xl">Add Product</h2>

            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Name</span> 
                <input ref={refName} className="bg-black rounded p-1 m-1 w-8/12" type="text" placeholder="name" />
            </div>

            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Price</span> 
                <input ref={refPrice} className="bg-black rounded p-1 m-1 w-8/12" type="number" min={1} placeholder="price" />
            </div>
            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Quantity</span> 
                <input ref={refQuantity} className="bg-black rounded p-1 m-1 w-8/12" type="number" min={1} placeholder="quantity" />
            </div>
            <div className="flex small:flex-col justify-between items-center w-10/12"> 
                <span className="text-black font-bold">Description</span> 
                <input ref={refDescription} className="bg-black rounded p-1 m-1 w-8/12" type="text" placeholder="description"  />
            </div>
            
            
            

            <div className="flex flex-col justify-center items-center">
                <label htmlFor="addProdImage" className="bg-white border-black border-2 text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                    <MdOutlineUploadFile className="text-black" />
                </label>

                <input type="file" id="addProdImage" name="file" accept="image/*" className="hidden" onChange={handleChooseImg}/>

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
 
            <button className="bg-black text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center hover:scale-110" onClick={startUploading}>
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
            <span className="text-black">{message}</span>
        </div>
    )
}
function UpdateProduct({selectedProduct, setSelectedProduct, products, setProducts}){
    
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [upImages, setUpImages] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const refName = useRef();
    const refPrice = useRef();
    const refQuantity = useRef();
    const refDescription = useRef();
    const setLogged = useContext(LoggedContext);

    useEffect(() => {
        if (selectedProduct !== undefined){
            refName.current.value = selectedProduct.name;
            refPrice.current.value = selectedProduct.price;
            refQuantity.current.value = selectedProduct.quantity;
            refDescription.current.value = selectedProduct.description;
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
        console.log("UPDATE");
        setUpImages((current) =>[...current, image]);
    }

    const startUploading = async ()=>{
        setLoading(true);
        
        let data = {
            productId: selectedProduct.productId,
            name: refName.current.value,
            price: refPrice.current.value,
            quantity: refQuantity.current.value,
            description: refDescription.current.value,
            images: upImages
        }
        console.log(data);
        console.log(products);
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
    return (
        <div className="flex flex-col justify-center items-center w-full my-2 p-2 bg-white rounded-xl">
            <h2 className="text-black p-2 font-bold text-xl">Update Product</h2>

            <input ref={refName} className="bg-black rounded p-1 m-1" type="text" placeholder="name"  />
            <input ref={refPrice} className="bg-black rounded p-1 m-1" type="number" min={1} placeholder="price"  />
            <input ref={refQuantity} className="bg-black rounded p-1 m-1" type="number" min={1} placeholder="quantity"  />
            <input ref={refDescription} className="bg-black rounded p-1 m-1" type="text" placeholder="description"  />

            <div className="flex flex-col justify-center items-center">
                <label htmlFor="upProdImage" className="bg-white border-black border-2 text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                    <MdOutlineUploadFile className="text-black" />
                </label>

                <input type="file" id="upProdImage" name="file" accept="image/*" className="hidden" onChange={handleChooseUpImg}/>

            </div>

            <div className="grid grid-cols-3 border-2 border-black text-black">
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
function ListProducts({products, setProducts,setSelectedProduct}){

    
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
            <p className="text-black p-2 m-2 font-bold text-l">Quantity : {product.quantity}</p>
            <p className="text-black p-2 m-2 font-bold text-l">Description : {product.description}</p>
        </div>
    )
}