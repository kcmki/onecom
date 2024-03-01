

export default function MainPageProducts({mainColor, secondColor,products}) {

    return (
        <div className="flex flex-col justify-center items-center w-full px-4">
            <h1 className="text-3xl font-bold py-4">Nos produits</h1>
            <p>These are the products that will be displayed on the main page.</p>
            {products.length}
        </div>
    )
    }