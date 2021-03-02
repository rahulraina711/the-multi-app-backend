const Post = require('../models/post_model');
const mongoose = require('mongoose');
const fs = require('fs');

exports.get_all_posts = (req, res) => {
    const token = req.cookies.token;
    console.log("token",token);
    Post.find().exec()
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
            res.status(200).json({
                likes:doc.likes,
                _id: doc._id,
                desc: doc.desc,
                postImage: doc.postImage,
                email: doc.email,
                request: {
                    type: 'GET',
                    url: 'https://imgur-backend.herokuapp.com/posts/' + doc._id
                }
            });
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
        email: req.userData.email,
        userId: req.userData.userId
    });
    post.save().then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Created product Successfully",
            _id: result._id,
            name: result.name,
            desc: result.desc,
            postImage: result.postImage,
            email: result.email,
            request: {
                type: 'GET',
                url: 'https://imgur-backend.herokuapp.com/posts/' + result._id
            },
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

exports.delete_a_post = (req, res, next) => {
    const logEmail = req.userData.email;
    const id = req.params.id;
    // verify
    Post.findById(id).exec()
        .then(doc => {
            if (doc.email !== logEmail) {
                return res.status(400).json({
                    message: "Access Denied"
                })
            }
            else{
                Post.findByIdAndDelete(id).exec()
                .then(doc => {       
                    res.status(200).json({
                        message: "Item deleted successfully"
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
