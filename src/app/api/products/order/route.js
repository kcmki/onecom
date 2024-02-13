"use server"
import { NextResponse } from 'next/server'
import db from '/lib/db'

export async function GET(req) {
    return NextResponse.json(
        {success:false,message:"Not authorized method"}
    ) 
}

export async function POST(req) {
    let token = req.headers.get('Authorization').split(" ")[1]
    //check authentification
    let session = await db.collection('sessions').findOne({sessionId:token})
    if(!session || session.expirationTime < Date.now()){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }
    let data = await req.json()
    //check product id
    if (!data.products ){
        return NextResponse.json(
            {success:false,message:"No product id"}
        )
    }
    data.products = data.products.map(async (command) => {
        let id = command.productId; 
        let quantity = command.quantity;
        let size = command.size;
        let prod = await db.collection('products').findOne({productId:id});
        let img = prod.images[0];
        let name = prod.name;
        return {productId:id,name:name,price:prod.price,quantity:quantity,size:size,img:img}
    })
    let orders = await Promise.all(data.products);

    return NextResponse.json(
        {success:true,orders:orders}
    )

}