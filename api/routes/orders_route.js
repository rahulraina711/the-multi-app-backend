const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Order = require('../models/order_model');
const Product = require('../models/product_model');
const User = require('../models/user_model');

// get all orders
router.get("/",auth,(req, res, next) => {
    const {userId} = req.userData;
    Order.find({userId}).populate('productId').exec()
        .then(doc => {
            let cartTotal = 0;
            for(let i=0;i<doc.length;i++){
                cartTotal += (doc[i].quantity*doc[i].productId.price)
            }
            res.status(200).json({cartTotal,doc});
        })
        .catch((err) => {
            console.log(err)
        });
});
// create a new order
router.post("/",auth,(req, res)=>{
    const uid = req.userData.userId;
    const order = new Order({
        productId: req.body.productId,
        quantity: req.body.quantity,
        userId: uid
    });
    order.save().then(
        async(doc)=>{
            const userO = await User.findByIdAndUpdate(uid,{$push:{orders:doc._id}});
            const getProduct = await Product.findById(req.body.productId);
            const updateProduct = await Product.findByIdAndUpdate(req.body.productId,{countInStock:getProduct.countInStock-1});
            res.status(201).json(doc)
        }
    ).catch(err=>{
        res.status(500).json({message: err})
    });
});

router.patch("/:id",auth,async(req, res)=>{
    const id = req.params.id;
    const {quantity} = req.body;
    try{
        const getOrder =await Order.findById(id);
        const patchedOrder = await Order.findByIdAndUpdate(id,{$set:{quantity}});
        const getProduct = await Product.findById(getOrder.productId);
        const updateProduct = await Product.findByIdAndUpdate(getOrder.productId,{countInStock:getProduct.countInStock+1-quantity});
        res.status(200).json(patchedOrder);
    }
    catch(err){
        res.status(200).json(err);
    }
})

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