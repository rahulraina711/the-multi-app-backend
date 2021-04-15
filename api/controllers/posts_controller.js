const Post = require('../models/post_model');
const mongoose = require('mongoose');
const fs = require('fs');

exports.get_all_posts = (req, res) => {
    Post.find().populate('Comment').exec()
        .then(doc => {
            
            // console.log("displaying all documents")
            res.status(200).json(doc);

        })
        .catch((err) => {
            console.log(err)
        });
}

exports.get_post_by_ID = (req, res, next) => {

    const id = req.params.id;
    //console.log(req.params.id);
    Post.findById(id).exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(400).json({
                message: err
            });
        });
}

exports.post_image = (req, res) => {

    const post = new Post({
        desc: req.body.desc,
        postImage: req.file.path,
        userId: req.userData.userId,
        isEvent: req.body.isEvent || "false"
    });
    post.save().then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Created product Successfully",
            _id: result._id,
            name: result.name,
            desc: result.desc,
            postImage: result.postImage,
            isEvent: result.isEvent,
        })
    }).catch((err) => {
        console.log(err)
    });
}

exports.patch_a_post = (req, res, next) => {
    const logEmail = req.userData.email;
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Post.findById(id).exec()
        .then(doc => {
            if (doc.email !== logEmail) {
                return res.status(400).json({
                    message: "Access Denied"
                })
            }
            else{
                Post.findByIdAndUpdate(id, {$set: updateOps}).exec()
                .then(doc => {

                    //console.log(doc);
        
                    res.status(200).json({
                        message: "Item updated successfully"
                    });
                })
            }
        })      
        .catch(err => {
            res.status(400).json({
                message: err
            });
        });
}

exports.delete_a_post =async (req, res, next) => {
    const id = req.params.id;

    try{
        const deletepost = await Post.findByIdAndDelete(id);
        res.status(204).json({message:"post deleted"})
    }
    catch(err){
        res.status(500).json(err) 
    }

}
