
import Link from 'next/link'

export default function MainPageProducts({mainColor, secondColor,products}) {

    return (
        <div className="flex flex-col justify-center items-center w-full px-4">
            <h1 className="text-3xl font-bold py-4">Nos produits</h1>
            <div className="flex flex-wrap justify-center items-center w-3/4 small:w-full">
                {products.map((product,index) => {
                    return <ProductCard product={product} key={index} mainColor={mainColor}/>
                })}
            </div>
        </div>
    )
}


function ProductCard({product,mainColor}){

    return (
        
        <Link href={`/products/${product.productId}`} className="shadow-xl flex flex-col justify-center items-center w-1/4 max-w-40 small:w-1/2 border-4 rounded-xl m-1 max-h-72 min-h-72 " style={{borderColor:mainColor}}>
            <img src={product.images[0]} alt={product.name} className="w-full rounded-t-lg "/>
            <div className="flex justify-center items-center h-lvh">
                <h2 className="text-xl font-bold">{product.name}</h2>
            </div>
            <p className="text-red-600 font-bold rounded">{product.price}</p>
            <div className="hover:text-lg dark:bg-white dark:text-black bg-black text-white flex justify-center items-center w-full h-10 rounded-b-lg font-bold">Achetez</div>
        </Link>
    )
}