const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    try{
        const token = req.cookies.token ;
        console.log(token);

        if(!token) return res.status(401).json({message:"Auth failed"});

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log(decoded);
        next(); 
    }
    catch (err){
        return res.status(401).json({message:"Auth failed"});
    }
    
}

