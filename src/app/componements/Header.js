"use server"

import Link from 'next/link'
import SearchBox from './SearchBox';

export default async function Header({logo, mainColor, secondColor,name}){

    return(
    <header className='w-full h-16 flex justify-between items-center px-5 py-2' style={{backgroundColor:mainColor}}>
      <Link href='/' className="w-1/5">
        <img src={logo} alt={name}  className='h-12 rounded'/>
      </Link>

      <Link href='/products' className="font-bold text-xl small:text-sm hover:underline w-1/5">
        Produits
      </Link>

      <Link href='/Commandes' className="font-bold text-xl small:text-sm hover:underline w-1/5">
        Commandes
      </Link>

      <SearchBox />
  
    </header>
    )
  }