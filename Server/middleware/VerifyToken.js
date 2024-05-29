const jwt = require('jsonwebtoken');



const verifyToken =  (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){

        console.error('Middleware --- Failed (401) Unauthorized');

        res.status(401).json({
            status: 401,
            msg : 'Unauthorized',
            show_msg : 'Perlu Login'
        });
    } 
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, (err, decoded) => {
        
        if(err) {
            console.error('Middleware --- Failed (403) Forbidden');
            
            return res.status(403).json({
                status: 403,
                msg : 'Forbidden',
                show_msg : 'Perlu Token Baru'
            });;
        }

       

        req.userData = {
            id: decoded._id,
            username: decoded.user_name,
            email: decoded.email,
            role : decoded.role
        };
        next();
    });

    
}


module.exports = verifyToken;