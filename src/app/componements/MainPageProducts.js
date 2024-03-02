

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
        <a href={"/produit/"+product.productId} className="flex flex-col justify-center items-center w-1/4 max-w-40 small:w-1/2 border-4 rounded-xl m-1" style={{borderColor:mainColor}}>
            <img src={product.images[0]} alt={product.name} className="w-full rounded-t-lg "/>
            <div className=" h-20 flex justify-center items-center">
                <h2 className="text-xl font-bold">{product.name}</h2>
            </div>
            <p className="text-red-600 font-bold rounded">{product.price}</p>
        </a>
    )
}