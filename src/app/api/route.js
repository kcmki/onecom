"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'

export async function POST(req) {

  return NextResponse.json(
    {message:""}
  )
}