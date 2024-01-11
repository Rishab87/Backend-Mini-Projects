const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
const fileUpload = require('express-fileupload'); 
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/',

}));

const dbConnect = require('./config/database');
dbConnect();

const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

const upload = require('./routes/fileUpload');
app.use('/api/v1/upload' , upload);

app.listen(PORT , ()=>{
    console.log(`app is running at port ${PORT}`);
});