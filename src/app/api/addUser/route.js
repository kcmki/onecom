"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'

// endpoint to create a user using email, password and userRole (has to be admin and logged in)

export async function GET(req) {
    return NextResponse.json(
      { success: false , message: 'use POST method to login'}
    )
  }

export async function POST(req) {
    
    let requestjson = await req.json();

    let reqSessionid = req.headers.get('Authorization').split(" ")[1];
    let dataSession = await db.collection('sessions').findOne({sessionId:reqSessionid});
    //check session
    if(!dataSession || dataSession.expirationTime < Date.now()){
        try{
            await db.collection('sessions').deleteOne({sessionId:reqSessionid})
        }catch(e){}
        return NextResponse.json(
            {message:"Invalid session"}
        )
    }
    //check user
    let dataUser = await db.collection('users').findOne({_id:dataSession.userId});
    if (!dataUser){
        return NextResponse.json(
            {message:"Invalid user"}
        )
    }
    //check perms
    if(dataUser.userRole != "admin"){
        return NextResponse.json(
            {message:"You are not authorized to add users"}
        )
    }
        
    let email = requestjson.email;
    let password = requestjson.password;
    let userRole = requestjson.userRole;

    let userId = await db.collection('users').find({}).count()
    
    try{
        db.collection('users').insertOne({userId:userId,email:email,password:password,userRole:userRole}, function(err, res) {
        if (err) throw err;
            db.close();
        }) 
    }
    catch (e) {
        return NextResponse.json(
        {message:"Couldn't add user",error:e.message}
        )
    }
    return NextResponse.json(
        {message:"User added"}
    )
}