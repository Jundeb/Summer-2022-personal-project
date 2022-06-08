const jwt = require('jsonwebtoken');

//to get the bearer token
//user must have logged in

//the bearer token is send to a client as a cookie when auth goes trough
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403); //invalid token
            req.username = decoded.userInfo.username;
            req.roles = decoded.userInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT;