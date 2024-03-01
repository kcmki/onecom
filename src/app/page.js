"use server"
import db from '/lib/db'
import MainPageProducts from './componements/MainPageProducts';
import { FiShoppingCart } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import Slider  from './componements/Slider';

export default async function Home() {

  let data = await db.collection('site').findOne({});
  let products = await db.collection('products').find({visible:true}).sort({ date: 1 }).limit(10).toArray();
  let mainColor = data.mainColor;
  let secondColor = data.secondColor;
  let logo = data.logo;
  let name = data.name;
  let images = data.images;
  return (
    <main className="flex flex-col items-center justify-between">

        <Header logo={logo} mainColor={mainColor} secondColor={secondColor} name={name} />
        <Slider images={images} mainColor={mainColor} secondColor={secondColor}/>
        <MainPageProducts products={products} mainColor={mainColor} secondColor={secondColor}/>

        <Footer name={name} />
    </main>
  );
}


function Header({logo, mainColor, secondColor,name}){
  return(
  <header className='w-full h-16 flex justify-between items-center px-5 py-2' style={{backgroundColor:mainColor}}>
    <a href='/cart'>
      <FiShoppingCart size="2em"/>
    </a>
    <a href='/'>
      <img src={logo} alt={name}  className='h-12 rounded'/>
    </a>
    <a href='/search'>
      <CiSearch size="3em" />
    </a>

  </header>
  )
}

function Footer({name}){
  return(
  <footer className='w-screen h-10 flex justify-center items-center p-5'>
    <span>
      &copy; {new Date().getFullYear()} Kim Shop {name} - All rights reserved
    </span>
  </footer>
  )

}