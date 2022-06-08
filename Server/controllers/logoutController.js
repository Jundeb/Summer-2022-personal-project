const User = require('../models/User');

const handleLogout = async (req, res) => {
    //on client also delete accessToken
    const cookies = req.cookies;
    if(!cookies?.userCookie) return res.sendStatus(401); //no content

    const refreshToken = cookies.userCookie;

    //checks if refreshToken is in db
    const foundUser = await User.findOne({ refreshToken }).exec();

    if(!foundUser) {
        res.clearCookie('userCookie', { httpOnly: true, sameSite: 'None'}); //after dev set secure: true
        return res.sendStatus(204);
    }

    //Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result); //delete after dev
    res.clearCookie('userCookie', {httpOnly: true, sameSite: 'None'}); //after dev set secure: true -only serves https
    res.sendStatus(204);
}

module.exports = { handleLogout }