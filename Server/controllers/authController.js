const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//returns userId, accesstoken and the RefreshToken as a cookie to client if username and password are correct 
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
                { expiresIn: '1800s' } //valid for 30 minutes
            );
            
        const refreshToken = jwt.sign(
                { 'username': foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' } //valid for 1 day
            );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        const usersID = foundUser._id;

        res.cookie('userCookie', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60  * 1000});
        return res.json({ usersID, accessToken });
    } else return res.sendStatus(401);
}

//if username and password with requests body are correct, change the password for username
const changePassword = async (req, res) => {

    if (!req?.body?.username) return res.status(400).json({ 'message': 'Username is required.' });
    if (!req?.body?.password) return res.status(400).json({ 'message': 'Password required.' });
    if (!req?.body?.newPassword) return res.status(400).json({ 'message': 'New password required.' });

    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    const foundUser = await User.findOne({ username: username }).exec();

    if (!foundUser) return res.status(404).json({ 'message': `No user matches username.` });

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        try {
            //encrypting the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            //save password
            foundUser.password = hashedPassword;

            const result = await foundUser.save();

            res.status(200).json({ 'success': `Password changed succesfully.` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    else if (!match) {
        res.status(401).json({ 'message': 'Username or password incorrect.' });
    }
}

module.exports = { handleLogin, changePassword }