const Post = require('../models/post_model')

exports.add_like = async (req, res) =>{
    const {id} =req.params;
    const {userId}=req.userData;

    try {
        const addLikeTOPost = await Post.findByIdAndUpdate(id,{$push:{likes: userId}});
        res.status(200).json(addLikeTOPost);
    } catch (err) {
        res.status(500).json(err);
    }

}

exports.remove_like = async (req, res)=>{
    const {id} = req.params;
    const {userId} = req.userData;
    try {
        const removeLikeFromPost = await Post.findByIdAndUpdate(id,{$pull:{likes: userId}});
        res.status(200).json(removeLikeFromPost);
    } catch (err) {
        res.status(500).json(err); 
    }
}