const express = require('express');
const router = express.Router();
const Product = require('../models/product_model');

router.get("/search", async (req, res)=>{
    const {key} = req.query;
    const patt = new RegExp("/"+key+"/", "gm");
    try{
        const searchRes = await Product.find({name: { $regex: `${key}`, $options: 'i' } });
    res.status(200).json(searchRes);
    } catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;