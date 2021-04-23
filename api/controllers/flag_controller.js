const Flag = require('../models/flag_model');

exports.flag_post = async (req, res)=>{

    try{
        const {id} = req.params
        const flag = new Flag({
            id
        })

        const savedFlag = await flag.save();

        res.status(200).json({message:"Flagged post successfully"})
    } catch (err){
        res.status(500).json({message: "something went wrong "})
    }
}