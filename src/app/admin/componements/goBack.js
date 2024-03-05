export default function GoBack({setState}){

    return (
        <button className="w-full h-10 text-black bg-white rounded hover:font-bold border-2 border-black dark:border-[#e5e7eb]" onClick={()=>{setState("menu")}}>Go to menu</button>
    )
}