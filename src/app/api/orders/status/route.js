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
    //check if user is valid
    let user = await db.collection('users').findOne({userId:session.userId})
    if(!user){
        return NextResponse.json(
            {success:false,message:"Not authorized no user"}
        )
    }
    let data = await req.json()
    let order = await db.collection('orders').findOne({orderId:data.orderId})
    //check order
    if(!order){
        return NextResponse.json(
            {success:false,message:"Order not found"}
        )
    }
    if(order.lock){
        return NextResponse.json(
            {success:false,message:"Order is locked"}
        )
    }
    //check if order is already taken
    let owner = await db.collection('users').findOne({userId:order.userId})
    if(owner.userId !== user.userId){
        return NextResponse.json(
            {success:false,message:"Order not aviable"}
        )
    }
    if (data.status != "Pending" &&data.status != "On delivery" && data.status != "Delivered" &&  data.status != "Canceled"){
        return NextResponse.json(
            {success:false,message:"Invalid status"}
        )
    }
    
    if(order.lock){
        return NextResponse.json(
            {success:false,message:"Order is locked"}
        )
    }

    try{
        await db.collection('orders').updateOne({orderId:data.orderId,lock: { $in: [false, undefined] }},{$set:{status:data.status}})
        return NextResponse.json(
            {success:true,message:"updated status"}
        )
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Error"}
        )
    }
}