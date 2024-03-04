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
    let data = await req.json()
    let number = Number(data.number)
    try{
        let orders = await db.collection("orders").find({clientPhone:number},{projection:{_id:0,clientName:1,status:1,clientAdresse:1,clientWilaya:1,totalPrice:1,date:1}}).toArray()

        return NextResponse.json(
            {success:true,message:"Not authorized method",orders:orders}
        ) 
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Error while fetching orders"}
        ) 
    }

}