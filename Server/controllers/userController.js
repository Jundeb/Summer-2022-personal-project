const User = require('../models/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    //get all users from database
    const users = await User.find({});

    //no users found
    if(!users) return res.status(204).json({ 'message': 'No users found.'});

    res.json(users);
}

const getOneUser = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({ 'message': 'User id required.'});

    //find user by ID
    const user = await User.findOne({ _id: req.params.id}).exec();

    if(!user) return res.status(204).json({ 'message': `No user matches ID: ${req.params.id}.`});

    res.json(user);
}

const changePassword = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({ 'message': 'ID parameter is required.'});

    const user = await User.findOne({ _id: req.body.id}).exec();
   
    if(!user) return res.status(204).json({ 'message': `No user matches ID : ${req.body.id}.`});

    const newPassword = req.body.password;

    if(!newPassword) return res.status(400).json({'message': 'New password missing.'});

    try{
        //encrypting the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //save password
        const result = await user.save();

        console.log(result); //del after dev
       
        res.status(200).send({'success': `Password changed succesfully.`});
    } catch(err) {
        res.status(500).json({'message': err.message});
    }

    
}

module.exports = {
    getAllUsers,
    getOneUser,
    changePassword
}