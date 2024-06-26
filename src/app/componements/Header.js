"use server"

import Link from 'next/link'
import SearchBox from './SearchBox';

export default async function Header({logo, mainColor, secondColor,name}){

    return(
    <header className='w-full h-16 flex justify-between items-center px-5 py-2' style={{backgroundColor:mainColor}}>
      <Link href='/' className="w-12 h-12">
        <img src={logo} alt={name}  className='h-12 rounded'/>
      </Link>

      <Link href='/products' className="font-bold text-xl text-center small:text-sm hover:underline w-1/4">
        Produits
      </Link>

      <Link href='/commandes' className="font-bold text-xl text-center small:text-sm hover:underline w-1/4">
        Commandes
      </Link>

      <SearchBox />
  
    </header>
    )
  }