

"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'

export async function POST(req) {
    let reqSessionid = req.headers.get('Authorization').split(" ")[1];
    await db.collection('sessions').deleteOne({sessionId:reqSessionid})

    return NextResponse.json(
        {success:true,message:"Deleted session"}
    )
}