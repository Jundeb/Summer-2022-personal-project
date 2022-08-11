const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;

    //if origin where the request was sent is in allowedOrigins respond with "Access-Control-Allow-Origin"
    if(allowedOrigins.includes(origin)){
        res.header('Access-Control-Allow-Origin', true);
    }
    next();
}

module.exports = credentials;