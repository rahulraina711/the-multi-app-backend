const mongoose = require('mongoose');

const todoSchema= new mongoose.Schema({
    caption:{type: String, required:true},
    description:{type: String, default:"No description Available"},
    points:[{type: String}],
    userId:{type: String, required:true},
    private:{type: Boolean, default: false}
},
{timestamps:true});

module.exports = mongoose.model("Todo", todoSchema);