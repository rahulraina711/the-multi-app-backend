const mongoose = require('mongoose');

const postSchema= new mongoose.Schema({
    desc: {type: String, required: true},
    postImage: {type: String},
    userId:{type: String, required:true},
    isEvent:{type: String, default: "false"},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
},
{timestamps:true});

module.exports = mongoose.model("Post", postSchema);