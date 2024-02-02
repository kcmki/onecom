"use server"
import { NextResponse } from 'next/server'
import db from '/lib/db'


export async function GET(req) {
  return NextResponse.json(
    { success: false , message: 'use POST method to login'}
  )
}

export async function POST(req) {
  
  let requestjson = await req.json();
	let email = requestjson.email;
	let password = requestjson.password;

  const sessionId = generateSessionId(email,Date.now())

    return NextResponse.json(
    	{ success: true , message: 'Logged in as '+email+" SessionId: "+sessionId+" Database: "+process.env.MONGODB_URI}
    )
}

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

function generateSessionId(userId, timestamp) {
  return hash(userId + timestamp)
}