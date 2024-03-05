
import {useContext, useEffect, useState} from 'react';
import {LoggedContext} from '../../layout.js';
import { Oval } from 'react-loader-spinner';

export default function UserStats(){
    const setLogged = useContext(LoggedContext);
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let fetchData = async () => {
            let res = await fetch('/api/user/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('sessionId')
                }});
            if (res.status != 200){
                setLoading(false)
                return;
            }
            let response = await res.json();
            
            if (response.success) 
            {
                setData(response.data);

            }else{
                if (response.message == "Invalid session") {setLogged(false);localStorage.setItem('sessionId','');}
                alert(response.message);
            }

            setLoading(false);
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
    if (!loading && data ==undefined) return (<div className="p-2 m-2 w-full bg-white text-black rounded-xl text-center border-2 border-black dark:border-[#e5e7eb]">No data</div>)
    return(
    <div className="p-2 m-2 w-full bg-white text-black rounded-xl flex flex-col justify-start align-center border-2 border-black dark:border-[#e5e7eb]">
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
                        <td className="border-2 border-black text-center">CA/mois</td>
                        <td className="border border-black text-center">{data["CA/M"][0]}</td>
                        <td className="border border-black text-center">{data["CA/M"][1]}</td>
                    </tr>
                    <tr>
                        <td className="border-2 border-black text-center">Commande/semaine</td>
                        <td className="border border-black text-center">{data["CM/S"][0]}</td>
                        <td className="border border-black text-center">{data["CM/S"][1]}</td>
                    </tr>
                    <tr>
                        <td className="border-2 border-black text-center">Commande/mois</td>
                        <td className="border border-black text-center">{data["CM/M"][0]}</td>
                        <td className="border border-black text-center">{data["CM/M"][1]}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )
}