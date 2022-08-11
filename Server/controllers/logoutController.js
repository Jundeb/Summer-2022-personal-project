const User = require('../models/User');

//clears the userCookie and deletes refreshToken from database
const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.userCookie) return res.sendStatus(401);

    const refreshToken = cookies.userCookie;

    //checks if refreshToken is in database
    const foundUser = await User.findOne({ refreshToken }).exec();

    if(!foundUser) {
        res.clearCookie('userCookie', { httpOnly: true, secure: true, sameSite: 'None'});
        return res.sendStatus(204);
    }

    //Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    res.clearCookie('userCookie', {httpOnly: true, secure: true, sameSite: 'None'});
    return res.sendStatus(204);
}

module.exports = { handleLogout }