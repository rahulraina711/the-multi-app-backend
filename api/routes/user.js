const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


router.post('/signup', UserController.register_user);

router.post('/login', UserController.login_user);

router.get("/", UserController.get_user_posts);

router.get("/loggedIn", auth,(req, res)=>{
    try{
        const token = req.cookies.token;
        console.log(token);


        const validUser = jwt.verify(token, process.env.JWT_KEY);
       
        res.json(validUser);
    }
    catch (err){
        return res.status(401).json({"message":"nothing happened"});
    }
});

router.get("/loggedOut", (req, res)=>{
    try{
        res.cookie("token","",{
            httOnly: true,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : process.env.NODE_ENV === "production" && "none",
            secure: process.env.NODE_ENV === "development" ? false : process.env.NODE_ENV === "production" && true,
            expires: new Date(0),
        }

        ).send();
    }
    catch(err){
        return res.json({"message":"nothing happened"});
    }
})

module.exports = router;