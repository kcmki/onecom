"use client"

import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation"

export default async function SearchBox(){

    const router = useRouter();

    const handleSearch = (e) => {
        let search = document.getElementById('searchInput').value;
        console.log("search",search)
        e.preventDefault();
        router.push(`/products?search=${search}&page=1`);
        document.getElementById('searchInput').blur()
    }

    return(
        <form onSubmit={handleSearch} className='h-10 flex items-center justify-center small:justify-end rounded-md border-none outline-none w-1/4 z-10'>

            <input id="searchInput" type="text" className='h-10 w-0 focus:w-40 duration-500 rounded-l-md border-none outline-none text-black' placeholder='Rechercher'/>

            <label htmlFor="searchInput" className="w-10 h-10 focus:bg-white">
                <CiSearch size={35} />
            </label>
        </form>
    )
}