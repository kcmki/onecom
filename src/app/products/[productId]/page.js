"use server"
import db from '/lib/db'
import Header from '@/app/componements/Header'
import ProdSlider from './ProdSlider';
import "./product.css"
import Footer from '@/app/componements/Footer';
import FormCommande from './FormCommande';


export default async function page({params}){
    let productId = params.productId;

    let data = await db.collection('site').findOne({});
    if(!data){
        data = {
          mainColor: '#000000',
          secondColor: '#ffffff',
          logo: 'default-logo.png',
          name: 'My shop',
          images: []
      }}
    let mainColor = data.mainColor;
    let secondColor = data.secondColor;
    let logo = data.logo;
    let name = data.name;

    let product = await db.collection('products').findOne({productId:productId}, {projection:{_id:0}});

    return (
        <>
        <Header logo={logo} mainColor={mainColor} name={name} secondColor={secondColor} />
        <div className='grid grid-cols-2 small:grid-cols-1' >

            <div className='w-full flex justify-center items-center flex-col px-10'>
                <h1 className='text-2xl font-bold pt-4'>{product.name}</h1>
                <p className='text-xl font-bold text-red-600 py-4'>{product.price} Da</p>
                <ProdSlider images={product.images} secondColor={secondColor}/>
                <div className='w-full flex justify-center items-center flex-col px-10 border-2 border-black dark:border-[#e5e7eb] m-2 rounded-xl'>
                    <h2 className='text-xl font-bold py-1'>Description</h2>
                    <p>{product.description}</p>
                </div>
            </div>

            <div className='w-full flex justify-start items-center flex-col px-10 p-10'>
                <div className='w-full flex justify-center items-center flex-col px-6 border-2 border-black dark:border-[#e5e7eb] m-2 rounded-xl py-10' style={{backgroundColor:mainColor}}>
                    <h2 className='text-xl font-bold py-1'>Commander ce produit</h2>

                    <FormCommande product={product} />
                    
                </div>
            </div>


        </div>
        <Footer name={name} />
        </>
    );
}