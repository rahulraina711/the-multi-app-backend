const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts_controller')
const multer = require('multer');
const auth = require('../middleware/auth');
const Post = require('../models/post_model');;

// adding the storage location for images parsed by multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: storage
});

// get all the images in the database posted by different users
router.get("/", PostController.get_all_posts)

// get image of a specific id
router.get("/:id", PostController.get_post_by_ID)

// only authorized users can post photos
router.post("/", auth, upload.single('postImage'), PostController.post_image)

// only authorized users can patch photos
router.patch("/:id", auth, PostController.patch_a_post)

// only authorized users can delete photos
router.delete("/:id", auth, PostController.delete_a_post)

// monitor likes
router.put("/like",auth,(req, res)=>{
    const postId = req.body.postId;
    const userId = req.body.userId;
    Post.findByIdAndUpdate(postId,{$push:{likes:userId}}).exec()
    .then((doc)=>{res.status(201).json(doc)})
    .catch(err=>{res.status(401).jaon({message: err})});
})

// monitor unlike
router.put("/unlike",auth,(req, res)=>{
    const postId = req.body.postId;
    const userId = req.body.userId;
    Post.findByIdAndUpdate(postId,{$pull:{likes:userId}}).exec()
    .then((doc)=>{res.status(201).json(doc)})
    .catch(err=>{res.status(401).jaon({message: err})});
})

module.exports = router