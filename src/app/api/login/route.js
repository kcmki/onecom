"use server"
import { NextResponse } from 'next/server'
import db from '/lib/db'

// endpoint to login using email and password

export async function GET(req) {
  return NextResponse.json(
    { success: false , message: 'use POST method to login'}
  )
}

export async function POST(req) {
  
  	let requestjson = await req.json();
	let email = requestjson.email;
	let password = requestjson.password;
	var user = null;

	user = await db.collection('users').findOne({email:email,password:password});
	
	if (!user){
		return NextResponse.json(
			{ success: false , message: 'Invalid credentials'}
		)
	}
	let userId = user.userId
	const sessionId = generateSessionId(email,Date.now())
	
	let session = {sessionId:sessionId,userId:userId,expirationTime:Number(Date.now())+Number(process.env.SESSION_DURATION)}
	try{
		await db.collection('sessions').insertOne(session);
	}
	catch (e) {
		return NextResponse.json(
			{ success: false , message:"Error please try again"}
		)
	}
	await db.collection('sessions').deleteMany({userId:userId,expirationTime:{$lt:Date.now()}})
    return NextResponse.json(
    	{ success: true , sessionId:sessionId, name:user.name, email:email, userRole:user.userRole}
    )
}

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

function generateSessionId(email, timestamp) {
  return hash(email + timestamp)
}