const User = require('../models/user_model')
const jwt = require('jsonwebtoken');
const Product = require('../models/post_model')
const bcrypt = require('bcrypt'); // string hasher
const mongoose = require('mongoose');


exports.register_user = async (req, res, next) => {
    try {
        //(a password and email validation can be added here as well)
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);

        // unique email
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: "user already exists"
            })
        }
        const user = new User({
            email,
            password
        })
        const savedUser = await user.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
}

exports.login_user = async (req, res, next) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        // unique email
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            //res.status(201).json(existingUser);
            bcrypt.compare(password, existingUser.password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        message: "auth failed"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: existingUser.email,
                        userId: existingUser._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    res.cookie("token", token, {
                        httOnly: true,
                        sameSite: process.env.NODE_ENV === "development" ? "lax" : process.env.NODE_ENV === "production" && "none",
                        secure: process.env.NODE_ENV === "development" ? false : process.env.NODE_ENV === "production" && true,
                    }).json({
                        message: "auth successful",
                        token: token
                    });
                    // res.status(201).json({message: "auth done", token: token})
                }
            }) // a slight issue with wrong password, the server times out (yet to be fixed)
        } else {
            res.status(401).json({
                message: "auth failed"
            })
        }

    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
}

exports.get_user_posts = (req, res, next) => {
    let email = req.query.email;
    Product.find({
            email: email
        }).exec()
        .then(docs => {
            console.log("displaying all documents")
            res.status(200).json(docs);

        })
        .catch((err) => {
            console.log(err)
        });

}