const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productId : {type: mongoose.Schema.Types.ObjectId, required: true ,ref: 'Product'},
    quantity : {type: Number, default: 1},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true ,ref: 'User'},
    
})

module.exports = mongoose.model("Order", orderSchema);