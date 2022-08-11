const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        //if the origin where the request was sent is not in allowedOrigins response will be "Not allowed by CORS"
        if(allowedOrigins.indexOf(origin) !== -1){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;