const User = require('../models/User');
const jwt = require('jsonwebtoken');

//if user returns to main page returns a new accesstoken
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.userCookie) return res.sendStatus(401);

    const refreshToken = cookies.userCookie;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if(!foundUser) return res.sendStatus(403); //Forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);
            
            const accessToken = jwt.sign(
                { 'userInfo': {
                    'username': decoded.username,
                    'roles': roles
                    }
                 },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1800s'} //valid for 30 minutes
            );
            res.json({ accessToken });
        }
    );
    

}

module.exports = { handleRefreshToken}