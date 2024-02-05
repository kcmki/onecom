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
    if(session === null || session.expirationTime < Date.now()){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }

    let data = await req.json()
    //check product id
    let productId = data.productId
    if (productId === "" || productId < 0 || productId === undefined || productId === null){
        return NextResponse.json(
            {success:false,message:"Product does not exist in database"}
        )
    }
    // updating query
    try{
        await db.collection('products').deleteOne({productId:productId})
        return NextResponse.json(
            {success:true,message:"Deleted product successfully"}
        )
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Error please try again"}
        )
    }
}