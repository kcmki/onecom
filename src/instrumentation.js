import db from '/lib/db'

const { createHash } = require('node:crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
export function register() {

    let setup = async () => {
        let data = await db.collection('site').findOne({});
        let userMail = process.env.USER_MAIL || 'admin@admin.com';
        let userPassword = hash(process.env.USER_PASSWORD || 'admin');

        let Logo =  base64_encode("./public/default-logo.png");
        let Cover =  base64_encode("./public/default-cover.jpg");

        let defaultData = {
            mainColor: '#FFFFFF',
            secondColor: '#000000',
            logo: Logo,
            name: process.env.DBNAME || 'My Store',
            images: [Cover]
        }

        let defaultUser = {
            name: 'Admin',
            mail: userMail,
            password: userPassword,
            userRole: 'admin',
            userId: hash(userMail)
        }

        try{
            if (data == undefined){
                db.collection('site').insertOne(defaultData);
            }
            let userExists = await db.collection('users').findOne({mail: userMail});
            if (userExists == undefined){
                db.collection('users').insertOne(defaultUser);
            }
        }catch(e){
            console.log(e);
        }
    }
    setup();
}