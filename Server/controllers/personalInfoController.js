const User = require('../models/User');

const updateInfo = async (req, res) => {

    if(!req?.body?.id){
        return res.status(400).json({ 'message': 'ID parameter is required.'});
    }

    const foundUser = await User.findOne({ _id: req.body.id }).exec();

    if(!foundUser) return res.status(204).json({ "message": `No User matches ID : ${req.body.id}.`})
    

    if(req.body?.firstname) foundUser.personal_info.firstname = req.body.firstname;
    if(req.body?.lastname) foundUser.personal_info.lastname = req.body.lastname;
    if(req.body?.address) foundUser.personal_info.address = req.body.address;
    if(req.body?.phonenumber) foundUser.personal_info.phonenumber = req.body.phonenumber;

    const result = await foundUser.save();
    res.status(200).json({'success': 'Personal info updated.'});
}


module.exports = {
    updateInfo
}