const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) return res.status(400).json({'message': 'Username and password required.'});
    const foundUser = await User.findOne({ username: username }).exec();
    if(!foundUser) return res.sendStatus(401); //Unauthorized

    const match = await bcrypt.compare(password, foundUser.password);
    if(match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //if match creating jwts
        const accessToken = jwt.sign(
                { 
                    'userInfo': {
                    'username': foundUser.username,
                    'roles': roles
                    }
                 },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1000s' } //change after dev
            );
        const refreshToken = jwt.sign(
                { 'username': foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' } //change after dev
            );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        const usersID = foundUser._id;
        const personal_info = foundUser.personal_info;

        res.cookie('userCookie', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60  * 1000}); //set secure: true after dev
        res.json({ usersID, accessToken });
    } else res.sendStatus(401);
}

module.exports = { handleLogin }