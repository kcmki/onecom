import { NextResponse } from 'next/server'
 

export async function GET(req) {
  return NextResponse.json(
    { success: false , message: 'use POST method to login'}
  )
}

export async function POST(req) {
  
    let requestjson = await req.json();

	let email = requestjson.email;
	let password = requestjson.password;

    return NextResponse.json(
    	{ success: true , message: 'Logged in as '+email,password: password}
    )
}