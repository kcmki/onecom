"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'
import { group } from 'console';

// endpoint to create a user using email, password and userRole (has to be admin and logged in)

export async function GET(req) {
    return NextResponse.json(
        { success: false , message: 'use POST method to get stats'}
    )
}

export async function POST(req) {
    
    let requestjson = await req.json();

    let reqSessionid = req.headers.get('Authorization').split(" ")[1];
    let dataSession = await db.collection('sessions').findOne({sessionId:reqSessionid});
    //check session auth
    if(!dataSession || dataSession.expirationTime < Date.now()){
        try{
            await db.collection('sessions').deleteOne({sessionId:reqSessionid})
        }catch(e){}
        return NextResponse.json(
            {success:false,message:"Invalid session"}
        )
    }
    //get user
    let dataUser = await db.collection('users').findOne({userId:dataSession.userId});
    if (!dataUser){
        return NextResponse.json(
            {success:false,message:"Invalid user"}
        )
    }
    //check perms & password
    if(dataUser.userRole != "admin"){
        return NextResponse.json(
            {success:false,message:"You are not authorized to add users"}
        )
    }
    if (requestjson.password != dataUser.password){
        return NextResponse.json(
            {success:false,message:"Invalid password"}
        )
    }
    //check data
    if (!requestjson.name || !requestjson.email || !requestjson["new password"] || !requestjson.userRole){
        return NextResponse.json(
            {success:false,message:"All fields are required"}
        )
    }
    //check passwords
    if (requestjson["new password"] !== hash(requestjson["confirm password"])){
        return NextResponse.json(
            {success:false,message:"Passwords don't match"}
        )
    }
    // check unique email
    let data = await db.collection('users').findOne({email:requestjson.email});
    if (data){
        return NextResponse.json(
            {success:false,message:"Email already in use"}
        )
    }
    let name = requestjson.name;
    let email = requestjson.email;
    let password = requestjson["new password"];
    let userRole = requestjson.userRole;

    let userId = hash(email);
    
    try{
        db.collection('users').insertOne({userId:userId,name:name,email:email,password:password,userRole:userRole})
    }
    catch (e) {
        return NextResponse.json(
        {success:false,message:"Couldn't add user",error:e.message}
        )
    }
    return NextResponse.json(
        {success:true,message:"User added"}
    )
}



const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

function generateSessionId(userId, timestamp) {
  return hash(userId + timestamp)
}