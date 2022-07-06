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

    const personalInfo = user.personal_info;

    const accountId = user.bank_accounts[0]._id;
    const accountNumber = user.bank_accounts[0].account_number;
    const balance = user.bank_accounts[0].balance;
    const limit = user.bank_accounts[0].limit;

    const account1 ={ 
        "accountId": accountId,
        "accountNumber": accountNumber,
        "balance": balance,
        "limit": limit
    };

    if(user.bank_accounts.length === 1){
        res.json({personalInfo, account1});
    }
    else{
        const accountId2 = user.bank_accounts[1]._id;
        const accountNumber2 = user.bank_accounts[1].account_number;
        const balance2 = user.bank_accounts[1].balance;
        const limit2 = user.bank_accounts[1].limit;

        const account2 ={ 
            "accountId": accountId2,
            "accountNumber": accountNumber2,
            "balance": balance2,
            "limit": limit2
            };

        res.json({personalInfo, account1, account2});
    }
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
       
        res.status(200).json({'success': `Password changed succesfully.`});
    } catch(err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = {
    getAllUsers,
    getOneUser,
    changePassword
}