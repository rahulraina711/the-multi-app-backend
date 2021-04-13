const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/comment_model');
const Post = require('../models/post_model');



// get comment based on ID
router.get("/:id",(req, res)=>{
    const id = req.params.id;

    Comment.findById(id).exec()
    .then(docs => {
        res.status(201).json(docs);
        //console.log(docs)
    })
    .catch(err=>{
        res.status(400).json({message: err});
    });

} );

// post comment on an image of a specific id
router.post("/:id",auth, (req, res)=>{
    const postId = req.params.id;

    const comment = new Comment({
        comment: req.body.comment,
        postId: postId,
        userId:req.userData.userId
    });
    comment.save().then(async doc=>{
        const comm = await Post.findByIdAndUpdate(postId,{$push:{comments: doc.id}})
        res.status(201).json(doc)
    }).catch(err=>{
        res.status(401).json({message: err})
    });
} );

module.exports = router;
