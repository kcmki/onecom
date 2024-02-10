"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}
function generateSessionId(email, timestamp) {
    return hash(email + timestamp)
}

export async function GET(req) {
  return NextResponse.json({ success: false, message: 'use POST method to get stats' })
}

//endpoint to get update logged in user 
export async function POST(req){
    let token = req.headers.get('Authorization').split(" ")[1];
    //check authentification
    let session = await db.collection('sessions').findOne({sessionId:token});
    if (!session || session.expirationDate < Date.now()) return NextResponse.json({ success: false, message: 'Not authorized' });
    //get user
    let data = await req.json();
    //check data
    if (!data) return NextResponse.json({ success: false, message: 'No data' });
    //verify new password
    if (data["new password"] != "")
        if (data["new password"] !=hash(data["confirm password"])) return NextResponse.json({ success: false, message: 'Different passwords' });
    //check password
    if (!data.password) return NextResponse.json({ success: false, message: 'No password' });
    let user = await db.collection('users').findOne({userId:session.userId});
    if (data["password"] != user.password) return NextResponse.json({ success: false, message: 'Wrong password' });
    //setup data to update user
    if (data.name != "") user.name = data.name;
    if (data.email != "") user.email = data.email;
    if (data["new password"] != "") {
        user.password = data["new password"];
        if (hash(data["confirm password"]) != user.password)  return NextResponse.json({ success: false, message: 'Error passwords restart' });
    }
    
    //update user
    try{
        await db.collection('users').updateOne({userId:session.userId},{$set:user});
    }catch(e){
        return NextResponse.json({ success: false, message: 'Error please try again' });
    }
    //generate new session
    let newSessionId = generateSessionId(user.email,Date.now());
    let newSession = {sessionId:newSessionId,userId:session.userId,expirationTime:Number(Date.now())+Number(process.env.SESSION_DURATION)}
    try{
        await db.collection('sessions').insertOne(newSession);
    }catch(e){
        newSession = session
    }
    return NextResponse.json({ success: true, sessionId:newSessionId,name:user.name, email:user.email, userRole:user.userRole });
}