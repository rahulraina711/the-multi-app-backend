const User = require('../models/user_model')
const jwt = require('jsonwebtoken');


// unified sign up or sign in
exports.sign_in = async (req, res, next) => {
    try {
        //(a password and email validation can be added here as well)
        const googleToken = req.headers.authorization;
        // console.log(googleToken);
        const googleContent = jwt.decode(googleToken);
        const {
            name,
            email,
            picture,
        } = googleContent;
        //console.log(name, email,  picture);


        // unique email
        const existingUser = await User.findOne({
            email
        });
        console.log("Existing User",existingUser);
        if (existingUser) {
            const token = jwt.sign({
                userId: existingUser._id
            }, process.env.JWT_KEY, {
                expiresIn: "21h"
            })
            return res.status(201).json({authToken: token, user: existingUser})
        }
        else{
            const user = new User({
                name,
                email,
                profilePic: picture
            })
            const savedUser = await user.save();
            //console.log("Saved User",savedUser);
            const newToken = jwt.sign({
                userId: savedUser._id
            }, process.env.JWT_KEY, {
                expiresIn: "21h"
            })
            return res.status(201).json({authToken: newToken, user: savedUser});
        }

    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
}

// get users stuff
// exports.get_user_posts = (req, res, next) => {
//     let email = req.query.email;
//     Product.find({
//             email: email
//         }).exec()
//         .then(docs => {
//             //console.log("displaying all documents")
//             res.status(200).json(docs);

//         })
//         .catch((err) => {
//             console.log(err)
//         });

// }
// details about a user from id
exports.get_user = async function(req, res, next) {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
}

// setting user details
exports.set_user = async function(req, res, next) {
    const {id} = req.params;
    const{name,about,occupation} = req.body;

    console.log(id,name,about,occupation);
    try {
        const updatedUser = await User.findByIdAndUpdate(id,{$set:{name,about,occupation}})
        const user = await User.findById(id);
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json(err);
    }
}
