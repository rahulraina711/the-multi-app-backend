const mongoose = require('mongoose');

const commentSchema= new mongoose.Schema({
    comment: {type: String, required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    email:{type: String, required:true}
},
{timestamps:true});

module.exports = mongoose.model("Comment", commentSchema);