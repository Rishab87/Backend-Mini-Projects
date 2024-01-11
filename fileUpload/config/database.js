const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("DB connected successfully"))
    .catch((error)=>{
        console.error(error);
        console.log("Failed to connect to DB");
        process.exit(1);
    });
}

module.exports = dbConnect;