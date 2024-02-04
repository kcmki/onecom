"use server"
import { NextResponse } from 'next/server'
import db from '/lib/db'

// endpoint to fetch data
export async function GET(req) {
    let token = req.headers.get('Authorization').split(" ")[1]
    //check authentification
    let session = await db.collection('sessions').findOne({sessionId:token})
    if(session === null || session.expirationTime < Date.now()){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }
    //fetch data
    try{
        let reqData = await req.json()
        let id = reqData.id
        
        let data = await db.collection('products').findOne({productId:id})
        return NextResponse.json(
            {success:true,message:"",data:data}
        )
    }catch(e){
        let data = await db.collection('products').find({}).toArray()
        return NextResponse.json(
            {success:true,message:"",data:data}
        )
    }
}
// endpoint to add data
export async function POST(req) {
    let data = await req.json()
    let token = req.headers.get('Authorization').split(" ")[1]
    //check authentification
    let session = await db.collection('sessions').findOne({sessionId:token})
    if(session === null || session.expirationTime < Date.now()){
        return NextResponse.json(
            {success:false,message:"Not authorized"}
        )
    }
    //check data
    let exist = await db.collection('products').findOne({name:data.name})
    if(exist){
        return NextResponse.json(
            {success:false,message:"Product already exists change name"}
        )
    }
    if (data.name === "" || data.price < 1 || data.quantity < 1 || data.description === ""){
        return NextResponse.json(
            {success:false,message:"Check fields"}
        )
    }
    //add data
    let num = await db.collection('products').find({}).count()
    data.productId = num
    try{
        await db.collection('products').insertOne(data)
        return NextResponse.json(
            {success:true,message:"Added data successfully"}
        )
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Error adding product"}
        )
    }
}