const File = require('../models/file');
const cloudinary = require('cloudinary').v2;

exports.localFileUpload = async(req , res)=>{
    try{
        
        const file = req.files.file; 
        console.log(file);

        let path = __dirname + "/files/" + Date.now() +`.${file.name.split('.')[1]}`; //file ke andar name key uske andar se extension ko nikalna hai aur dalna pdega extension bhi path main

        file.mv(path , (err)=>{
            console.error(err); 
        });

        res.json({
            success: true , 
            message: "Local file uploaded successfully",
        })
    } catch(error){
        console.error(error);
        console.log("Error uploading local file");
    }
}

function isFileTypeSupported(type , supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file , folder , quality){ 
    const options =  {folder};
    options.resource_type = "auto"; 
    if(quality){
        options.quality = quality; 
    }
    return await cloudinary.uploader.upload(file.tempFilePath , options);
    
}

//img upload handler
exports.imageUpload = async(req , res)=>{
    try{
        const {name  , tags , email} = req.body;
        console.log(name , tags, email);

        const file = req.files.imageFile; 
        console.log(file);

        //Validation
        const supportedTypes = ['jpeg' , 'jpg' , 'png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType , supportedTypes)){
            return res.status(400).json({
                success:false,
                message: "File format not supported",
            });
        }

        const response  = await uploadFileToCloudinary(file , "Rishab");
        console.log(response); 

        //db main entry save
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.json({
            success: true , 
            imageUrl: response.secure_url,
            message: "Image successfully uploaded",
        });


    } catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

exports.videoUpload = async (req, res)=>{
    try{
        const {name  , tags , email} = req.body;
        console.log(name , tags, email);

        const file = req.files.videoFile;

        const supportedTypes = ["mp4" , "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File type: " , fileType);

        const size = file.size
        console.log("Buffer length:", file.data.length);
        if(!isFileTypeSupported(fileType , supportedTypes) && size > 5){ 
            return res.status(400).json({
                success: false,
                message: "File format not supported or file size limit exceeded",
            });
        }

        const response  = await uploadFileToCloudinary(file , "Rishab");
        console.log(response); 

        //db main entry save
        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url,
        });

        res.json({
            success: true , 
            videoUrl: response.secure_url,
            message: "Video successfully uploaded",
        });

    } catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

exports.imageSizeReducer = async(req , res)=>{
    try{
        const {name  , tags , email} = req.body;
        console.log(name , tags, email);

        const file = req.files.imageFile; 
        console.log(file);

        //Validation
        const supportedTypes = ['jpeg' , 'jpg' , 'png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType , supportedTypes)){
            return res.status(400).json({
                success:false,
                message: "File format not supported",
            });
        }


        const response  = await uploadFileToCloudinary(file , "Rishab" , 30); 
        console.log(response);

        //db main entry save
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.json({
            success: true , 
            imageUrl: response.secure_url,
            message: "Image successfully uploaded",
        });


    } catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}