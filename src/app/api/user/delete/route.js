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
        
    // check request userId
    let data = await req.json();
    if (!data.userId) 
        return NextResponse.json(
            { success: false , message: 'userId is required'}
        )
    //check password
    if (!data.password) 
        return NextResponse.json(
            { success: false , message: 'password is required'}
        )
    if (data.password !== user.password)
        return NextResponse.json(
            { success: false , message: 'Wrong password'}
        )
    // check user existence
    let userToDelete = await db.collection('users').findOne({userId:data.userId});
    if (!userToDelete) 
        return NextResponse.json(
            { success: false , message: 'User not found'}
        )
    // delete user
    try{
        await db.collection('users').deleteOne({userId:data.userId});
        return NextResponse.json(
            { success: true , message: 'Dleteed user successfully'}
        )
    }catch(e){
        return NextResponse.json(
            { success: false , message: 'Error'}
        )
    }

}