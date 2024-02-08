export default function GoBack({setState}){

    return (
        <button className="w-full h-10 text-black bg-white rounded hover:font-bold" onClick={()=>{setState("menu")}}>Go to menu</button>
    )
}