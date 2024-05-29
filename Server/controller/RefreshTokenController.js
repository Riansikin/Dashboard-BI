const UserModel = require("../model/UserModel");
const jwt = require('jsonwebtoken');


module.exports = {
    resfreshToken : async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            
            if (!refreshToken) {
                console.error('GET /refresh --- Unauthorized (401)');
                return res.sendStatus(401);
            }
    
            const user = await UserModel.findOne({ refresh_token : refreshToken });
    
            if (!user) {
                console.error('GET /refresh --- Forbidden (403)');
                return res.sendStatus(403);
            }
    
    
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCRETE, (err, decoded) => {
                if (err) {
                    console.error('GET /refresh --- Invalid Token (403)');
                    return res.sendStatus(403);
                }

                const { _id, user_name, email, role } = user;

                const accessToken = jwt.sign({ 
                    id : _id, uname : 
                    user_name, 
                    email : email, 
                    role : role
                }, process.env.ACCESS_TOKEN_SECRETE, {
                        expiresIn : '40s'
                });

                console.error('GET /refresh --- Success (201)');
    
                res.json({ 
                    token : accessToken
                 });
            });

        } catch (error) {

            console.error(
                `GET /refresh --- Failed (500):`,
                JSON.stringify(error.message)
            );
        
            return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
                show_msg: "Sistem dalam gangguan, coba lagi nanti",
            });
            
        }
    }
    
}


