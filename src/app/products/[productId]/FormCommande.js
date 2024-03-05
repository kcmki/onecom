"use client"
import  {useState,useRef} from 'react';
import {Oval} from 'react-loader-spinner'

export default function FormCommande({product}) {
    const [loading, setLoading] = useState('')
    const [message, setMessage] = useState('')
    const refName = useRef()
    const refPrenom = useRef()
    const refTel = useRef()
    const refAdresse = useRef()
    const refVille = useRef()
    const refQuantite = useRef()
    const refSize = useRef()
    const refTotalPrice = useRef()
    
    let inputs = [["Nom",refName],[ "Prenom",refPrenom],["Telephone",refTel],["Adresse",refAdresse],["Quantite",refQuantite]]
    let wilayasAlgerie = [
        "Adrar",
        "Chlef",
        "Laghouat",
        "Oum El Bouaghi",
        "Batna",
        "Béjaïa",
        "Biskra",
        "Béchar",
        "Blida",
        "Bouira",
        "Tamanrasset",
        "Tébessa",
        "Tlemcen",
        "Tiaret",
        "Tizi Ouzou",
        "Alger",
        "Djelfa",
        "Jijel",
        "Sétif",
        "Saïda",
        "Skikda",
        "Sidi Bel Abbès",
        "Annaba",
        "Guelma",
        "Constantine",
        "Médéa",
        "Mostaganem",
        "M'Sila",
        "Mascara",
        "Ouargla",
        "Oran",
        "El Bayadh",
        "Illizi",
        "Bordj Bou Arréridj",
        "Boumerdès",
        "El Tarf",
        "Tindouf",
        "Tissemsilt",
        "El Oued",
        "Khenchela",
        "Souk Ahras",
        "Tipaza",
        "Mila",
        "Aïn Defla",
        "Naâma",
        "Aïn Témouchent",
        "Ghardaïa",
        "Relizane",
        "Timimoun",
        "Bordj Badji Mokhtar",
        "Ouled Djellal",
        "Béni Abbès",
        "In Salah",
        "In Guezzam",
        "Touggourt",
        "Djanet",
        "El M'Ghair",
        "El Menia"
    ];
    const addCommand = async () => {
        setLoading(true)
        let data ={

            clientName: refName.current.value +" "+ refPrenom.current.value,
            clientPhone: Number(refTel.current.value),
            clientAdresse: refAdresse.current.value,
            clientWilaya: refVille.current.value,

            products: [{productId:product.productId,size:refSize.current.value,quantity:Number(refQuantite.current.value)}]
        }
        if (data.clientName == ''  || data.clientPhone == '' || data.clientAdresse == '' || data.clientWilaya == '' || refSize.current.value == '') {
            setMessage('Veuillez remplir tout les champs')
            setLoading(false)
            return
        }
        if (Number(refQuantite.current.value) <1 || Number(refQuantite.current.value) >5){
            setMessage('la quantité doit etre entre 1 et 5')
            setLoading(false)
            return
        }
        let NextResponse = await fetch('/api/orders/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (NextResponse.status !== 200) {
            setMessage('Erreur lors de l\'ajout de la commande')
            setLoading(false)
            return
        }
        let response = await NextResponse.json()

        if (response.success) {
            setMessage('Commande ajouté avec success')
        }else{
            setMessage('Erreur lors de l\'ajout de la commande :'+response.message)
        }
        setLoading(false)
    }

    const totalPrice = () => {
        let price = product.price
        let quantite = refQuantite.current.value
        refTotalPrice.current.textContent = price * quantite
    }
    return (
        <div className='w-full flex justify-center items-center flex-col text-black'>

            {
                inputs.map((input, index) => {
                    if (input[0] === 'Quantite') return (
                        <div className='grid grid-cols-4 small:grid-cols-1 w-full p-2' key={index}>
                            <label htmlFor={input[0]} className='font-bold flex small:justify-center items-center'>{input[0]}</label>
                            <input id={input[0]} ref={input[1]} className='col-span-3 w-full p-2  rounded-xl border-2 border-black dark:border-[#e5e7eb]' type="number" min={1} max={5} onChange={totalPrice} placeholder={1} defaultValue={1} />
                        </div>
                    )
                    return (
                        <div className='grid grid-cols-4 small:grid-cols-1 w-full p-2' key={index}>
                            <label htmlFor={input[0]} className='font-bold flex small:justify-center items-center'>{input[0]}</label>
                            <input id={input[0]} ref={input[1]} className='col-span-3 w-full p-2 border-2 rounded-xl border-black dark:border-[#e5e7eb]' type="text" placeholder={input[0]} />
                        </div>
                    )
                })
            }
            <div className='grid grid-cols-4 small:grid-cols-1 w-full p-2' >
                <label htmlFor={"size"} className='font-bold flex small:justify-center items-center'>Wilaya</label>
                <select id={"size"} className='col-span-3 w-full p-2 border-2 rounded-xl border-black dark:border-[#e5e7eb]' ref={refVille}>
                {
                    wilayasAlgerie.map((wilaya, index) => {
                        return <option key={index} value={wilaya}>{(index+1) + "-" +wilaya}</option>
                    })
                }
                </select>
            </div>
            <div className='grid grid-cols-4 small:grid-cols-1 w-full p-2' >
                <label htmlFor={"size"} className='font-bold flex small:justify-center items-center'>Size</label>
                <select id={"size"} className='col-span-3 w-full p-2 border-2 rounded-xl border-black dark:border-[#e5e7eb]' ref={refSize}>
                {
                    product.Qsizes.map((size, index) => {
                        return <option key={index} value={size["size"]}>{size["size"]}</option>
                    })
                }
                </select>
            </div>

            <div className='text-2xl font-bold'>Total price : <span className='text-red-600' ref={refTotalPrice}>{product.price}</span> Da </div>
            <button className='w-full p-2 m-2 border-2 rounded-xl bg-red-600 text-white flex justify-center items-center border-black dark:border-[#e5e7eb]' onClick={addCommand}>
                {
                    loading ? <Oval
                    visible={true}
                    height="24"
                    width="24"
                    color="#000"
                    secondaryColor="#000"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />  : 'Commander'
                }
            </button>
            <p className='h-10 w-full text-center'> {message}</p>
        </div>
    );
}