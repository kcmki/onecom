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
            {success:false,message:"Not authorized"}
        )
    }
    //get user and check privileges
    let user = await db.collection('users').findOne({userId:session.userid})
    if(!user){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }
    if(user.userRole !== 'admin'){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }
    //get orders
    let projection = {_id:0}
    let orders = await db.collection('orders').find({},{projection}).toArray()
    return NextResponse.json(
        {success:true,message:"Got data",orders:orders}
    )
}