const express = require('express');
const router = express.Router();

const {login , signup} = require('../controllers/Auth');
const {auth , isStudent , isAdmin} = require('../middlewares/auth');
const user = require('../models/user');

router.post("/login" , login);
router.post("/signup" , signup);

//testing protected routes for single middleware
router.get('/test' , auth , (req,res)=>{
    res.json({
        success: true,
        message: "welcome to the protected route for TESTS" 
    });
});

//protected-route--> jiske pass role hai woh wala wahi dekh skta hai , eg student ke role wale student route hi dekh skte hai admin nhi.
router.get('/student' , auth , isStudent , (req,res)=>{ //iss path ke liye handler nhi likha idhr hi bta diya kya return krna chahte hai
    res.json({
        success: true,
        message: "welcome to the protected route for students" //abhi ui nhi bnaya toh msg se kam chla rhe hai
    });
}); //iss path main konse middleware use honge btana pdega

router.get('/admin' , auth , isAdmin , (req,res)=>{ 
    res.json({
        success: true,
        message: "welcome to the protected route for admins" 
    });
});

// router.get('/getEmail' , auth , async (req,res)=>{
//     try{
//         const id = req.user.id;
//         const User = await user.findById(id); //syntax revise kro mongoose ke functions ka
//         res.status(200).json({
//             success:true,
//             message: "Welcome to the email route",
//             user: User,
//         })
//     } catch(error){
//         res.status(500).json({
//             success:false,
//             message: "Errorr",
//             error: error.message,
//         })
//     }
    

// })

module.exports = router;