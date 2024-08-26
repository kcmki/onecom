import { NextResponse } from 'next/server'
import db from '/lib/db'

// endpoint to update site data (has to be admin and logged in)

export async function GET(req) {

    let token = req.headers.get('authorization').split(' ')[1]
    let session = await db.collection("sessions").findOne({sessionId:token})
    if (!session || session.expirationDate < Date.now())  return NextResponse.json({ success: false , message: 'Not authorized' })
    let user = await db.collection("users").findOne({userId:session.userId})
    try {
        if (!user) return NextResponse.json({ success: false , message: 'Not authorized' })
    }
    catch (e) {
        return NextResponse.json({ success: false , message: 'Not authorized' })
    }
    if (user.userRole !== 'admin') return NextResponse.json({ success: false , message: 'Not authorized' })
    let data = await db.collection("site").findOne({})
    if (!data) return NextResponse.json({ success: false , message: 'No data' })
    return NextResponse.json(
        { success: true , message: 'Here is data',name:data.name,logo:data.logo,images:data.images,mainColor:data.mainColor,secondColor:data.secondColor}
    )
}

export async function POST(req) {
    let token = req.headers.get('authorization').split(' ')[1]
    let session = await db.collection("sessions").findOne({sessionId:token})
    if (!session || session.expirationDate < Date.now())  return NextResponse.json({ success: false , message: 'Not authorized' })
    let user = await db.collection("users").findOne({userId:session.userId})
    try {
        if (!user) return NextResponse.json({ success: false , message: 'Not authorized' })
    }
    catch (e) {
        return NextResponse.json({ success: false , message: 'Not authorized' })
    }
    let data = await req.json()
    if (user.userRole !== 'admin') return NextResponse.json({ success: false , message: 'Not authorized' })
    if (user.password != data.password) return NextResponse.json({ success: false , message: 'Not authorized wrong password' })
    
    // check if data is valid
    if (!data.name || !data.logo || !data.mainColor || !data.secondColor) return NextResponse.json({ success: false , message: 'Invalid data' })
    // update data
    try{
        let site = await db.collection("site").findOne({})
        if(!site) await db.collection("site").insertOne({name:data.name,logo:data.logo,images:data.images,mainColor:data.mainColor,secondColor:data.secondColor})
        else await db.collection("site").updateOne({},{$set:{name:data.name,logo:data.logo,images:data.images,mainColor:data.mainColor,secondColor:data.secondColor}})
        await res.revalidate('/');
        await res.revalidate('/commandes');
    }catch(e){
        return NextResponse.json({ success: false , message: 'Error updating data' })
    }
    
    return NextResponse.json(
        { success: true , message: 'successfully updated'}
    )
}