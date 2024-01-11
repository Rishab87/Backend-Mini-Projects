const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.createComment = async(req, res)=>{
    try{
        //fetch data from req body
        const {post , user , body} = req.body;
        const comment = new Comment({ 
            post,user,body
        });

        const savedComment = await comment.save();

        const updatedPost = await Post.findByIdAndUpdate(post ,{$push:{comments: savedComment._id}} , {new:true})
                            .populate("comments")
                            .exec();
        res.json({
            post:updatedPost,
        });
    }
    catch(error){
        return res.status(500).json({
            error:"error while creating comment",
        }); 
    }
}