const express = require('express');
const app = express();

require('dotenv').config();

PORT = process.env.PORT || 4000;

app.use(express.json());

const blog = require('./routes/blog');

app.use("/api/v1" , blog); 

const connectWithDb = require("./config/database");
connectWithDb();

app.listen(PORT , ()=>{
    console.log(`server started at port ${PORT}`);
})
