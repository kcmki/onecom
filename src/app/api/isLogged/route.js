"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'

// check if user is logged in and respond with user data

export async function GET(req) {
    return NextResponse.json(
      { success: false , message: 'use POST method to login'}
    )
  }

export async function POST(req) {

        let reqSessionid = req.headers.get('Authorization').split(" ")[1];
        let dataSession = await db.collection('sessions').findOne({sessionId:reqSessionid});
        //check session
        if(!dataSession || dataSession.expirationTime < Date.now()){
            
            try{
                await db.collection('sessions').deleteOne({sessionId:reqSessionid})
            }catch(e){}

            return NextResponse.json(
                {success:false,message:"Invalid session"}
            )
        }
        //check user
        let dataUser = await db.collection('users').findOne({userId:dataSession.userId});
        if (!dataUser){
            return NextResponse.json(
                {success:false,message:"Invalid user"}
            )
        }

        // create new session id 
        let newSessionId = generateSessionId(dataUser.email,Date.now())
        let newSession = {sessionId:newSessionId,userId:dataUser.userId,expirationTime:Date.now()+process.env.SESSION_DURATION}
        let created = false
        try{
            await db.collection('sessions').insertOne(newSession)
            created = true
            await db.collection('sessions').deleteOne({sessionId:reqSessionid})
        }
        catch (e) {
            if (!created)
                newSessionId = sessionId
        }
        //return user data and new session
        dataUser = {
            newSessionId:newSessionId,
            userId:dataUser.userId,
            email:dataUser.email,
            userRole:dataUser.userRole
        }
        return NextResponse.json(
            {success:true,user:dataUser}
        )
}


const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

function generateSessionId(userId, timestamp) {
  return hash(userId + timestamp)
}