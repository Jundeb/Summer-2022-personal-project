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
                { expiresIn: '10s' } //change after dev
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

        res.cookie('userCookie', refreshToken, { httpOnly: true,  maxAge: 24 * 60 * 60  * 1000}); //set secure: true after dev and update options!!
        return res.json({ usersID, accessToken });
    } else return res.sendStatus(401);
}

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