import { MdOutlineKeyboardArrowDown ,MdOutlineKeyboardArrowUp,MdOutlineUploadFile} from "react-icons/md";
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';
import {imageBase64} from '../../../../utils.js';

export default function SiteUpdate(){

    const [shown, setShown] = useState(false);
    const [logo, setLogo] = useState(undefined);
    const [images, setUpImages] = useState(undefined);
    const [mainColor, setMainColor] = useState("#000000");
    const [secondColor, setSecondColor] = useState("#000000");
    const [Uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [dataLoading, setDataLoading] = useState(true);
    const [siteName, setSiteName] = useState("");
    async function handleChooseUpImg(e){
        let file = e.target.files[0];
        const image = await imageBase64(file);
        if (images === undefined) setUpImages([image]);
        else    setUpImages((current) =>[...current, image]);
    }
    async function handleChooseLogo(e){
        let file = e.target.files[0];
        const image = await imageBase64(file);
        setLogo(image);
    }
    async function handleMainColor(e){
        setMainColor(e.target.value);
    }
    async function handleSecondColor(e){
        setSecondColor(e.target.value);
    }
    async function handleNameChange(e){
        setSiteName(e.target.value);
    }
    async function SiteUpdate(){
        setUploading(true);
        let password = document.getElementById('siteUpdatePassword').value;
        try{
            if (password === undefined || password === null || password == '') throw new Error('Password not valid');
            else password = hash(password);
            let UploadingData = {name:siteName,logo: logo, images: images, mainColor: mainColor, secondColor: secondColor,password, password}
            console.log(UploadingData);
            let response = await fetch('/api/user/siteUpdate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('sessionId')
                },
                body: JSON.stringify(UploadingData)
            });
            if (response.status != 200){
                setMessage('Error');
                setUploading(false)
                return;
            }
            let data = await response.json();
            if(data.success){
                setMessage(data.message);
            }
            else
                throw new Error('Site update failed : ' + data.message);
        }catch(e){
            setMessage(e.message);
        }
        setUploading(false);
    }
    //loading data
    useEffect(() => {
        setDataLoading(true);
        let fetchData = async () => {
            let resp = await fetch('/api/user/siteUpdate/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
                }});
            if (resp.status != 200){
                setMessage('Error');
                setDataLoading(false)
                return;
            }
            let data = await resp.json();
            try{
                if ( !data.success && data.message === 'No data') throw new Error('No data found');
                if (!data.success) throw new Error('Failed to get site data '+data.message);
                setSiteName(data.name);
                setLogo(data.logo);
                setUpImages(data.images);
                setMainColor(data.mainColor);
                setSecondColor(data.secondColor);
                console.log("success");
            }catch(e){
                setMessage(e.message);
            }
            setDataLoading(false);
        }
        fetchData();
    },[shown]);
    if (dataLoading) return (
        <div className={"p-2 m-2 w-full bg-white flex flex-col justify-start items-center text-black rounded-xl overflow-hidden duration-500 transition"+ (shown ?"":" h-12 ")} >

            <h1 className="text-2xl text-center flex justify-around items-center h-8 w-full" onClick={()=>{setShown(!shown)}}> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
            <span className='hover:scale-110 select-none'>Update site</span> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>
            <div className="my-4">
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
            </div>
        </div>
    )
    return (
        <div className={"p-2 m-2 w-full bg-white text-black rounded-xl overflow-hidden duration-500 transition "+ (shown ?"":" h-12 ")} >

            <h1 className="text-2xl text-center flex justify-around items-center h-8" onClick={()=>{setShown(!shown)}}> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />} 
            <span className='hover:scale-110 select-none'>Update site</span> 
            { shown? <MdOutlineKeyboardArrowUp />: <MdOutlineKeyboardArrowDown />}
            </h1>

            <div className={"grid grid-cols-2 m-2 font-bold small:grid-cols-1"}>
                { /* Name */ }
                <div className={"flex  justify-center items-center w-full col-span-2 small:flex-col"}>
                    <h1>Enter name</h1>
                    <input type="text" id="siteUpdateName" className="w-8/12 p-1 m-2 rounded border-2 border-black" defaultValue={siteName} onChange={handleNameChange} required />
                </div>
                { /* Logo */ }
                <div className={"flex flex-col justify-center items-center w-full small:col-span-2"}>
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1>Choose Logo</h1>
                        <label htmlFor="imgLogo" className="bg-white border-black border-2 text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                            <MdOutlineUploadFile className="text-black" />
                        </label>
                        <input id="imgLogo" type="file" className="hidden" onChange={handleChooseLogo} />
                    </div>
                </div>
            
                <div className={"flex flex-col justify-center items-center w-full small:col-span-2"}> 
                    <img src={logo} className="w-20 h-20 rounded" />
                </div>
                { /* background images */ }
                <div className={"flex flex-col justify-center items-center w-full small:col-span-2"}>
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1>Choose header images</h1>
                        <label htmlFor="upBgImages" className="bg-white border-black border-2 text-white h-10 w-20 p-2 m-2 rounded flex justify-center items-center" >
                            <MdOutlineUploadFile className="text-black" />
                        </label>
                        <input id="upBgImages" type="file" className="hidden" onChange={handleChooseUpImg} />
                    </div>
                </div>

                <div className={"flex flex-row flex-wrap w-full border border-black rounded m-1 small:col-span-2"}> 
                    {   (images === undefined) ? "No images" : 
                        images.map((image, index) => {
                            return (
                            <div className="w-24 h-24 bg-red-600 rounded flex justify-center items-center m-1"> 
                                <img key={index} src={image} alt="product" className="w-24 h-24 rounded rounded hover:w-20 hover:h-20" onClick={()=>{let im = images.filter((img)=>{if(img!=image) return img});setUpImages(im)}} />
                            </div>
                            )
                        })
                    }
                </div>
                { /* colors */ }
                <div className={"flex  justify-center items-center w-full small:col-span-2"}>
                    <h1>Choose main color</h1>
                    <input type="color" className="w-10 h-10 mx-2 rounded" defaultValue={mainColor} onChange={handleMainColor}/>
                </div>
                <div className={"flex  justify-center items-center w-full small:col-span-2"}>
                    <h1>Choose secondary color</h1>
                    <input type="color" className="w-10 h-10 mx-2 rounded" defaultValue={secondColor} onChange={handleSecondColor}/>
                </div>

                { /* password and upload button */ }
                <div className={"flex justify-center items-center col-span-2 w-full"}> 
                    <div className="w-11/12 h-1 bg-black rounded my-4"></div>
                </div>
                <div className={"flex  justify-center items-center w-full col-span-2 small:flex-col"}>
                    <h1>Enter password</h1>
                    <input type="password" id="siteUpdatePassword" className="w-8/12 p-1 m-2 rounded border-2 border-black" required />
                </div>
                <div className="col-span-2 flex justify-center items-center">
                    <button className="bg-black text-white w-20 rounded p-2 m-2 hover:scale-110 flex justify-center items-center" onClick={()=>{SiteUpdate()}}> 
                    {Uploading ?                         
                            <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#FFF"
                            secondaryColor="#FFF"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            /> :"Update"}
                    </button>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                    <h1>{message}</h1>
                </div>
            </div>
        </div>
    )
}

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}