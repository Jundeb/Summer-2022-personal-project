const User = require('../models/User');
const crypto = require('crypto');

const createNewAccount = async (req, res) => {

    const username = req.body.username;

    if(!username)return res.status(400).json({'message': 'Username required.'});

    const foundUser = await User.findOne({username: username}).exec();
    if(!foundUser) return res.status(204).json({'message': 'No content found for username.'});

    if(foundUser.bank_accounts.length >= 2)return res.status(403).json({'message': 'Credit account already exists'});

    //creating random bankaccount num
    const randomString = crypto.randomBytes(6).toString('hex');

    foundUser.bank_accounts.push({
        'account_number': "FI"+randomString,
        'balance': 0,
        'limit': 2000
    });

    const result = await foundUser.save();

    res.status(200).json({'success': `New credit account ${foundUser.bank_accounts[1]} created.`});

}


module.exports = {createNewAccount};