"use server"
import db from '/lib/db'
import Header from '@/app/componements/Header'
import MainPageProducts from '@/app/componements/MainPageProducts';
import Link from 'next/link'
import Footer from '../componements/Footer';

export default async function page({params,searchParams}){

    const itemsByPage = 6;

    
    // get search text
    let search = searchParams.search;
    if(!search){
        search = '';
    }
    // get page number
    let page = Number(searchParams.page);
    if(!page || isNaN(page) || page < 1 ){
        page = 1;
    }

    // set up query for products
    const query = {
        $and: [
          { visible: true },
          {
            $or: [
              { name: { $regex: search, $options: "i" } }, // Case-insensitive search in title
              { description: { $regex: search, $options: "i" } } // Case-insensitive search in description
            ]
          }
        ]
      };

    // get products depending of query and page
    
    let products = await db.collection('products').find(query).sort({ date: 1 }).skip((page-1)*itemsByPage).limit(itemsByPage).toArray();
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

    return (
        <>
        <Header logo={data.logo} mainColor={mainColor} name={data.name} secondColor={secondColor} />

        {
            products.length === 0 ? <div className='w-full h-20 flex justify-center items-center'>Aucun produit trouvé</div> : <MainPageProducts products={products} mainColor={mainColor} secondColor={secondColor}/>
        }

        <div className='w-full h-20 flex justify-center items-center'>
            {
               page > 1 ?  
               <Link href={`/products?page=${page-1}`} className='mx-2 p-2 rounded-full w-24 text-center text-black dark:text-white	dark:border-white border-black border-2 hover:scale-110' style={{backgroundColor:mainColor}}>Précédent</Link>
               :
                <div className='mx-2 p-2 rounded-full w-24 text-center text-black dark:text-white	dark:border-white border-black border-2' style={{backgroundColor:mainColor,opacity:0.5}}>Précédent</div>
            }
            {
                products.length === itemsByPage ? 
                <Link href={`/products?page=${page+1}`} className='mx-2 p-2 rounded-full w-24 text-center hover:scale-110 text-black dark:text-white	dark:border-white border-black border-2' style={{backgroundColor:mainColor}}>Suivant</Link> 
                : 
                <div className='mx-2 p-2 rounded-full w-24 text-center text-black dark:text-white	dark:border-white border-black border-2' style={{backgroundColor:mainColor,opacity:0.5}}>Suivant</div>
            }
        </div>
        <Footer name={data.name} mainColor={mainColor} secondColor={secondColor} />
        </>
    );
}


