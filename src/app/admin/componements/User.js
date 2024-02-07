import GoBack from "./goBack"
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../layout.js';
import {AuthUpdate} from './utils.js';
import { Oval } from 'react-loader-spinner';
import { Route } from "next";


export default function User({setState}){

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
        <div className="flex flex-col justify-center items-center w-full">
            <GoBack setState={setState}/>
            <UserPower />

            {
                localStorage.getItem('userRole') === 'admin' ? <AdminPower /> : null
            }
        </div>
    )
}

function UserPower(){

    return(
        <>
            <UserStats />
            <UpdateUser />
        </>
    )
}

function UserStats(){
    const setLogged = useContext(LoggedContext);
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let fetchData = async () => {
            let res = await fetch('http://localhost:3000/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
                }});
            let response = await res.json();

            if (response.success) 
            {
                setData(response.data);

            }else{
                if (response.message == "Invalid session") {setLogged(false);localStorage.setItem('sessionId','');}
                alert(response.message);
            }

            setLoading(false);
            console.log(data);

        }
        fetchData();
    },[])

    if (loading) return (<div className='flex justify-center align-center bg-white rounded-xl p-2 m-2 w-full'> 
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
    if (!loading && data ==undefined) return (<div className="p-2 m-2 w-full bg-white text-black rounded-xl text-center">No data</div>)
    return(
    <div className="p-2 m-2 w-full bg-white text-black rounded-xl flex flex-col justify-start align-center">
        <div className="grid grid-cols-2 small:grid-cols-1" >
            <div className=""> 
                <div>user name : <span className="username">{data["nom"]}</span></div>
                <div>user mail : <span className="username">{data["email"]}</span></div>
                <div>user role : <span className="username">{data["role"]}</span></div>
            </div>
            <table className="table-auto border-spacing-0 border-2 border-black">
                <thead>
                    <tr>
                        <th className="border-2 border-black">Stat</th>
                        <th className="border-2 border-black ">Moi</th>
                        <th className="border-2 border-black ">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-2 border-black">CA/mois</td>
                        <td className="border border-black">{data["CA/M"][0]}</td>
                        <td className="border border-black">{data["CA/M"][1]}</td>
                    </tr>
                    <tr>
                        <td className="border-2 border-black">Commande/semaine</td>
                        <td className="border border-black">{data["CM/S"][0]}</td>
                        <td className="border border-black">{data["CM/S"][1]}</td>
                    </tr>
                    <tr>
                        <td className="border-2 border-black">Commande/mois</td>
                        <td className="border border-black">{data["CM/M"][0]}</td>
                        <td className="border border-black">{data["CM/M"][1]}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )
}

function UpdateUser(){
    let elements = [["username","text"],["email","text"],["new password","password"],["separator","separator"],["old password","password"]];
    return (
        <div className="p-2 m-2 w-full bg-white text-black rounded-xl h-12 overflow-hidden">
            <h1 className="text-2xl text-center hover:scale-110">Update</h1>
            <form className="flex flex-col justify-center items-center">
                {
                    elements.map((element,key) => {
                        if (element[0] === "separator") return <div className="w-11/12 h-1 bg-black rounded"></div>
                        return(
                            <div className="flex text-black w-10/12 justify-between items-center small:flex-col " key={key}>
                                <label for={"updateUser"+key} className="w-40 font-bold small:text-center">{element[0]}</label>
                                <input id={"updateUser"+key} type={element[1]} className="border-2 border-black m-2 rounded w-9/12" placeholder={element[0]} />
                            </div>
                        )
                    })
                }
                <input type="submit" className="border-2 border-black m-2 p-2 py-1 font-bold rounded " value="Update" />
            </form>
        </div>
    )
}

function AdminPower(){
    return(
        <>
            <div className="p-2 m-2 w-full bg-white text-black rounded-xl">
                <h1 className="text-2xl text-center">Update site (with password)</h1>
            </div>
            <div className="p-2 m-2 w-full bg-white text-black rounded-xl">
                <h1 className="text-2xl text-center">Add user</h1>
            </div>
            <div className="p-2 m-2 w-full bg-white text-black rounded-xl">
                <h1 className="text-2xl text-center">Delete user (with password)</h1>
            </div>
        </>
    )
}