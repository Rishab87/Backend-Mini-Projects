const bcrypt = require("bcrypt");
const user = require("../models/user");
const retry = require('async-retry');
const jwt = require('jsonwebtoken');
const { options } = require("../routes/user");
require("dotenv").config();

exports.signup = async(req,res)=>{
    try{
        const {name, email , password , role} = req.body;

        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        let hashedPassword;
        async function someOperation() {
            hashedPassword = await bcrypt.hash(password , 10) 
        }

        try {
            await retry(someOperation, {
                retries: 3,
                factor: 2,
                minTimeout: 1 * 1000,
                maxTimeout: 5 * 1000,
                onRetry: (error, attempt) => {
                    console.log(`Attempt ${attempt}: ${error.message}`);
                }
            });
        } catch (error) {
            console.error('Operation failed:', error);
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            });
        }

        const User = await user.create({
            name , email , password:hashedPassword , role //hashing main decrypt nhi kr skte toh password kaise match krayenge login ke time? --> bcrypt lib ke pass compare function hai usse do passwords ko verify kr skte hai uski internal working? read bcrypt doc
        });

        return res.status(200).json({
            success: true,
            message: "Successfully created user!",
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be regisetered",
        });
    }
};

exports.login = async(req, res)=>{
    try{
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        let User = await user.findOne({email});

        if(!User){
            return res.status(401).json({
                 success: false,
                 message: "User is not registered",
            });
        }
        const payload = {
            email: User.email,
            id: User._id, 
            role: User.role,
        } 
        
        if(await bcrypt.compare(password , User.password)){
            //pswd match
            let token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn: '2h'});

            User = User.toObject();
            User.token = token; 
            User.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            };
            //creating cookie
            res.cookie("token" , token , options).status(200).json({
                success: true,
                token, 
                User, 
                message: "User logged in successfully",
            }) 
        }
        else{
            //password do not match
            return res.status(403).json({
                success: false,
                message: "Password incorrect!",
            })
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure!',
        });
    }
}; 
 