const express = require('express');
const router = express.Router();
const Product = require('../models/product_model')
const multer = require('multer');
// const auth = require('../middleware/auth');


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

// get all the products in the database posted by different users
router.get("/", (req, res, next) => {
    Product.find().exec()
        .then(doc => {
            
            // console.log("displaying all documents")
            res.status(200).json(doc);

        })
        .catch((err) => {
            console.log(err)
        });
    
})

// get a product of a specific id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    //console.log(req.params.id);
    Product.findById(id).exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(400).json({
                message: err
            });
        });
})

// only authorized users can post photos
router.post("/", upload.single('productImage'), (req, res) => {

    const post = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        productImage: req.file.path,
        countInStock: req.body.countInStock
    });
    post.save().then((result) => {
        console.log(result);
        res.status(200).json(result)
    }).catch((err) => {
        console.log(err)
    });
})

module.exports = router;