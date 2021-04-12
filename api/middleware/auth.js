const jwt = require("jsonwebtoken");

module.exports = async (req, res, next)=>{
    try{
        const token = req.headers.authorization;
        //console.log(token);

        if(!token) return res.status(401).json({message:"Auth failed"});

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log("Here",decoded);
      
        req.userData = decoded;
        
        next(); 
    }
    catch (err){
        return res.status(401).json({message:"Auth failed"});
    }
    
}

