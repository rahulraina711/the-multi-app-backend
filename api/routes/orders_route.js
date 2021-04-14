const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Order = require('../models/order_model');
const User = require('../models/user_model');

// get all orders
router.get("/",auth,(req, res, next) => {
    const {userId} = req.userData;
    Order.find({userId}).populate('productId').exec()
        .then(doc => {
            
            // console.log("displaying all documents")
            res.status(200).json(doc);

        })
        .catch((err) => {
            console.log(err)
        });
    
})
// create a new order
router.post("/",auth,(req, res)=>{
    const uid = req.userData.userId;
    const order = new Order({
        productId: req.body.productId,
        quantity: req.body.quantity,
        userId: uid
       // user: req.userData.email || "not implemented"
    });
    order.save().then(
        async(doc)=>{
            const userO = await User.findByIdAndUpdate(uid,{$push:{orders:doc._id}});
            res.status(201).json(doc)
        }
    ).catch(err=>{
        res.status(500).json({message: err})
    });
});

// delete an order
router.get("/:id",(req, res) => {
    const id = req.params.id;
    
    Order.findByIdAndDelete(id).exec()
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

router.delete("/:id",(req,res)=>{
    const id = req.params.id;
    Order.findByIdAndDelete(id).exec().then(doc=>res.status(200).json(doc)).catch(err=>console.log(err));
})

module.exports = router;