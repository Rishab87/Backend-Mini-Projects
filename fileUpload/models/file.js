const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require("dotenv").config();

const fileSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    imageUrl:{
        type: String,
    },
    videoUrl:{
        type: String,
    },
    tags:{
        tpye: String,
    },
    email:{
        type:String,
    }
});

fileSchema.post("save" , async function(doc){
    try{
        console.log(doc); 
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,

            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: "Rishab",
            to: doc.email,
            subject: "New file uploaded to cloudinary",
            html: `<h2>Hello jee</h2> <p>File Uploaded</p> View here: <a href=${doc.videoUrl != undefined? (doc.videoUrl):(doc.imageUrl)}>${doc.videoUrl != undefined? (doc.videoUrl):(doc.imageUrl)}</a>`  
        });

        console.log(info);

    } catch(error){
        console.error(error);
    }
})
const File = mongoose.model("File" , fileSchema);
module.exports = File;