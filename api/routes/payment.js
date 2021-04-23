const express = require('express');
const router = express.Router();
const Insta = require('instamojo-nodejs');
const auth = require('../middleware/auth');
const API_KEY = process.env.API_KEY;
const AUTH_KEY = process.env.AUTH_KEY;

router.post("/" ,auth,(req, res)=>{
    const purpose = "gamers dash payment";
    const amount= req.body.amount;
    Insta.setKeys(API_KEY, AUTH_KEY);
    console.log(amount);

    Insta.isSandboxMode(true);

    let data = new Insta.PaymentData();

    data.purpose = purpose;
    data.amount = amount;
    const RDR = process.env.NODE_ENV==="dev" ? "http://localhost:3100/payment/success" : "https://gamers-dash.herokuapp.com/payment/success" 
    data.setRedirectUrl(RDR);
    Insta.createPayment(data, (err, response)=>{
        if(err){
           return res.status(500).json({message: err})
        } else{
            let JsonRes = JSON.parse(response);
            console.log(response);
            return res.status(200).json({url:JsonRes.payment_request.longurl});
        }
    })
})

router.get("/success",(req,res)=>{
    res.status(200).send("Hello Insta Mojo");
})

module.exports=router;