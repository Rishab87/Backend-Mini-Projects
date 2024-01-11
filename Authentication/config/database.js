const mongoose = require('mongoose');
require("dotenv").config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB connected successfully"))
    .catch((error)=>{
        console.log("Error connecting DB");
        console.error(error);
        process.exit(1);
    });
};

module.exports = dbConnect;