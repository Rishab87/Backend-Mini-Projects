const express = require('express');
const dbConnect = require('./config/database');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser'); 

app.use(cookieParser());
app.use(express.json());

dbConnect();

const user = require("./routes/user");
app.use("/api/v1" , user);

app.listen(PORT , ()=>{
    console.log(`APP is listening at ${PORT}`);
})