const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/comment_model');



// get all comments ona specific post
router.get("/:id",auth,(req, res)=>{
    const postId = req.params.id;

    Comment.find({postId : postId}).exec()
    .then(docs => {
        res.status(201).json(docs);
        console.log(docs)
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
        postId: req.body.postId,
        email:req.userData.email
    });
    comment.save().then(doc=>{
        res.status(201).json(doc)
    }).catch(err=>{
        res.status(401).json({message: err})
    });
} );

module.exports = router;
