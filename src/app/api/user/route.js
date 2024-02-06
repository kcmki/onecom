"use server"

import { NextResponse } from 'next/server'
import db from '/lib/db'
import { group } from 'console';

// endpoint to create a user using email, password and userRole (has to be admin and logged in)

export async function GET(req) {
    let reqSessionid = req.headers.get('Authorization').split(" ")[1];
    let dataSession = await db.collection('sessions').findOne({sessionId:reqSessionid});
    //check session and create new one
    if(!dataSession || dataSession.expirationTime < Date.now()){
        try{
            await db.collection('sessions').deleteOne({sessionId:reqSessionid})
        }catch(e){}
        return NextResponse.json(
            {success:false,message:"Invalid session"}
        )
    }

    
    // retrieving data
    try{
        let user = await db.collection('users').findOne({userId:dataSession.userId});
        let data = {nom:user.name,email:user.email,role:user.userRole}
        data["CM/S"] = [0,0]
        data["CM/M"] = [0,0]
        data["CA/M"] = [0,0]
        
        data["CM/S"][1] = await db.collection('orders').find({date:{$gte:Date.now()-604800000}}).count();
        data["CM/S"][0] = await db.collection('orders').find({userId:user.userId,date:{$gte:Date.now()-604800000}}).count();
        

        data["CM/M"][1] = await db.collection('orders').find({date:{$gte:Date.now()-2592000000}}).count();
        data["CM/M"][0] = await db.collection('orders').find({userId:user.userId,date:{$gte:Date.now()-2592000000}}).count();
    
        let groupResult = await db.collection('orders').aggregate([
                        {
                            $match: {
                                date: { $gte: Date.now() - 2592000000 }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalSum: { $sum: "$totalPrice" }
                            }
                        }
                    ]).toArray();
        groupResult = groupResult[0]
        data["CA/M"][1] = groupResult != undefined ? groupResult["totalSum"] : 0;
        groupResult = await db.collection('orders').aggregate([
                        {
                            $match: {
                                date: { $gte: Date.now() - 2592000000 },
                                userId: user.userId
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalSum: { $sum: "$totalPrice" }
                            }
                        }
                    ]).toArray();
        groupResult = groupResult[0]
        data["CA/M"][0] = groupResult != undefined ? groupResult["totalSum"] : 0;
        
        return NextResponse.json(
          { success: true , message: 'Data is succesfully sent',data:data}
        )
    }catch(e){
        return NextResponse.json(
            {success:false,message:"Couldn't retrieve data : "+e.message}
        )
    }
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
            {success:false,message:"Invalid session"}
        )
    }
    //check user
    let dataUser = await db.collection('users').findOne({_id:dataSession.userId});
    if (!dataUser){
        return NextResponse.json(
            {success:false,message:"Invalid user"}
        )
    }
    //check perms
    if(dataUser.userRole != "admin"){
        return NextResponse.json(
            {success:false,message:"You are not authorized to add users"}
        )
    }
        
    let email = requestjson.email;
    let password = requestjson.password;
    let userRole = requestjson.userRole;

    let userId = hash(email);
    
    try{
        db.collection('users').insertOne({userId:userId,email:email,password:password,userRole:userRole}, function(err, res) {
        if (err) throw err;
            db.close();
        }) 
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