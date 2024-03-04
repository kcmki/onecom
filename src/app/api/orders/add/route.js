"use server"
import { NextResponse } from 'next/server'
import db from '/lib/db'

//return all orders from the database
export async function GET(req) {
    return NextResponse.json(
        {success:false,message:"Not authorized method"}
    ) 
}

export async function POST(req) {
    //check if session is valid
    let data = await req.json()
    
    
    if (data.name === '' || data.prenom === '' || data.tel === '' || data.adresse === '' || data.ville === '' || data.size === '') {
        return NextResponse.json(
            {success:false,message:"Veuillez remplir tout les champs"}
        )
    }
    if (data.quantite <1 || data.quantite >5){
        return NextResponse.json(
            {success:false,message:"la quantité doit etre entre 1 et 5"}
        )
    }
    //get product
    var prix = 0
    //verification des produits de la commande
    data.products.map(async(prod) => {
        console.log(prod[0])
        let product = await db.collection('products').findOne({productId:prod[0]})
        if (!product) {
            return NextResponse.json(
                {success:false,message:"Product not found"}
            )
        }
        let found = false
        var prodPrice = 0
        product.Qsizes.forEach(size => {
            //verification taille et quantité
            if (size.size === prod[1]) {
                found = true
                if (size.quantity < prod[2]) {
                    return NextResponse.json(
                        {success:false,message:"Quantité non disponible"}
                    )
                }
            }
            if(found) return
        });
        if(!found){
            return NextResponse.json(
                {success:false,message:"Taille non valide"}
            )
        }
        prix = prix + (prod[2] * product.price)
    })

    data.orderId = await db.collection('orders').find().count()
    data.status = "Pending"
    data.date = Date.now()
    data.lock = false
    data.totalPrice = prix

    

    return NextResponse.json(
        {success:false,message:"ezez"}
    )
    //add the order to the database
    try {
        await db.collection('orders').insertOne(data)
       
       
        return NextResponse.json(
            {success:true,message:"Got data"}
        )
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Erreur lors de l'ajout de la commande"}
        )
    }

}