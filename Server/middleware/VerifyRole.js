const jwt = require("jsonwebtoken");

const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error("Middleware --- Failed (401) Unauthorized");
            return res.status(401).json({
                status: 401,
                msg: "Unauthorized",
                show_msg: "Perlu Login",
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE , (err, decoded) => {
            
            if (err) {
                console.error("Middleware --- Forbidden (403)");
                return res.status(403).json({
                    status: 403,
                    msg: "Forbidden",
                    show_msg: "Perlu Token Baru",
                    allowedRoles
                });
            }

            const userRole = decoded.role;

            if (!allowedRoles.includes(userRole)) {
                console.error("Middleware --- Forbidden Role (403)");
                return res.status(403).json({
                    status: 403,
                    msg: "Forbidden",
                    show_msg: "Akses Ditolak: Peran Pengguna Tidak Diperbolehkan",
                });
            }

            req.userData = {
                id: decoded.id,
                username: decoded.uname,
                email: decoded.email,
                role: decoded.role,
            };
                        
            next();
        });
    };
};

module.exports = verifyRole;
