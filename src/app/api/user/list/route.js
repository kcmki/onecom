"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'

// endpoint to list all users (has to be admin and logged in)
export async function GET(req) {
    return NextResponse.json(
        { success: false , message: 'use POST method to get stats'}
    )
}

export async function POST(req) {
    let token = req.headers.get('authorization').split(' ')[1];
    let session = await db.collection('sessions').findOne({sessionId: token});
    //check session validity
    if (!session || session.expirationDate < Date.now()) 
        return NextResponse.json(
            { success: false , message: 'Not authorized'}
        )
    //check user role and existence
    let user = await db.collection('users').findOne({userId: session.userId});
    if (!user || user.userRole !== 'admin') 
        return NextResponse.json(
            { success: false , message: 'Not authorized'}
        )

    // get users list
    let projection = {password:0,_id:0}
    let users = await db.collection('users').find({},{projection}).toArray();
    return NextResponse.json(
        { success: true ,message:"Successfully got users list" ,users: users}
    )
}