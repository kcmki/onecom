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
    let token = req.headers.get('authorization').split(" ")[1]
    let session = await db.collection('sessions').findOne({sessionId:token})
    //check if session is valid
    if(!session || session.expirationTime < Date.now()){
        return NextResponse.json(
            {success:false,message:"Not authorized "}
        )
    }
    //get user and check privileges
    let user = await db.collection('users').findOne({userId:session.userId})
    if(!user){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }
    //get orders that aren't getting managed by any user
    let projection = {_id:0}
    let orders = await db.collection('orders').find({userId:user.userId,lock: { $in: [false, undefined] }},{projection}).toArray()
    return NextResponse.json(
        {success:true,message:"Got data",orders:orders}
    )
}

export async function DELETE(req) {
    let token = req.headers.get('authorization').split(" ")[1]
    let session = await db.collection('sessions').findOne({sessionId:token})
    //check if session is valid
    if(!session || session.expirationTime < Date.now()){
        return NextResponse.json(
            {success:false,message:"Not authorized "}
        )
    }
    //get user and check privileges
    let user = await db.collection('users').findOne({userId:session.userId})
    if(!user){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }

    //delete userId from the coressponding data
    let data = await req.json()
    try{
        await db.collection('orders').updateOne(
            { orderId: data.orderId },
            { $unset: { userId: 1 } }
        );
        return NextResponse.json(
            {success:true,message:"Deleted"}
        ) 
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Error deleting"}
        )
    }

}