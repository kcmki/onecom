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

    let prix = 0
    //verification des produits de la commande
    let quantite = false
    let found = false

    for(let productCommand in data.products){
        
        let product = await db.collection('products').findOne({productId:data.products[productCommand].productId})
        if (!product) {
            return NextResponse.json(
                {success:false,message:"Produit non disponible"}
            )
        }
        for(let Qsize in product.Qsizes){
            if(product.Qsizes[Qsize].size == data.products[productCommand].size){
                found = true
                if(Number(product.Qsizes[Qsize].quantity) >= Number(data.products[productCommand].quantity)){
                    quantite = true
                    prix += product.price * data.products[productCommand].quantity
                    break
                }
            }
        }
    }
    // verify order products size and quantity
    if(!found){
        return NextResponse.json(
            {success:false,message:"Taille non disponible"}
        )
    }
    if (!quantite) {
        return NextResponse.json(
            {success:false,message:"Quantité non disponible"}
        )
    }

    data.orderId = await db.collection('orders').find().count()
    data.status = "Pending"
    data.date = Date.now()
    data.lock = false
    data.totalPrice = prix

    //get other waiting order with same number and is pending
    let waitingOrder = await db.collection('orders').findOne({clientPhone:data.clientPhone,status:"Pending"})
    // add products to the waiting order if exists
    if(waitingOrder){
        let exist = false
        for(let productCommand in waitingOrder.products){
            for(let product in data.products){
                if(waitingOrder.products[productCommand].productId === data.products[product].productId && waitingOrder.products[productCommand].size === data.products[product].size){
                    exist = true
                    waitingOrder.products[productCommand].quantity = Number(waitingOrder.products[productCommand].quantity) + Number(data.products[product].quantity)
                }
            }
        }
        if(!exist){
            waitingOrder.products.push(data.products[0])
        }
        waitingOrder.totalPrice = waitingOrder.totalPrice + data.totalPrice
        try{
            await db.collection('orders').updateOne({orderId:waitingOrder.orderId},{$set:{products:waitingOrder.products,totalPrice:waitingOrder.totalPrice}})
            //update stock of products
            let product = await db.collection('products').findOne({productId:data.products[0].productId})
            product.Qsizes.forEach(size => {
                if(size.size === data.products[0].size){
                    size.quantity = Number(size.quantity) - Number(data.products[0].quantity)
                }
            })
            await db.collection('products').updateOne({productId:product.productId},{$set:{Qsizes:product.Qsizes}})
            return NextResponse.json(
                {success:true,message:"Commande ajouté avec succées"}
            )
        }catch(e){
            return NextResponse.json(
                {success:false,message:"Erreur lors de l'ajout de la commande"}
            )
        }
    }

    //add the new order to the database
    try {
        await db.collection('orders').insertOne(data)
        //update stock of the products
        let product = await db.collection('products').findOne({productId:data.products[0].productId})
        product.Qsizes.forEach(size => {
            if(size.size === data.products[0].size){
                size.quantity = Number(size.quantity) - Number(data.products[0].quantity)
            }
        })
        await db.collection('products').updateOne({productId:product.productId},{$set:{Qsizes:product.Qsizes}})
        return NextResponse.json(
            {success:true,message:"Commande ajouté avec succées"}
        )
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Erreur lors de l'ajout de la commande"}
        )
    }

}