"use server"
import db from '/lib/db'
import Header from '@/app/componements/Header'
export default async function page({params}){
    let productId = params.productId;

    let data = await db.collection('site').findOne({});
    let mainColor = data.mainColor;
    let secondColor = data.secondColor;
    let logo = data.logo;
    let name = data.name;

    let product = await db.collection('products').findOne({productId:productId});

    return (
        <>
        <Header logo={logo} mainColor={mainColor} name={name} secondColor={secondColor} />
        <div className='flex flex-wrap w-full' >
            Heyyy all {product.name}
        </div>
        
        </>
    );
}