const User = require('../models/User');
const crypto = require('crypto');

const getAllAccountTransactions = async (req, res) => {

    const userId = req.body.userId;
    const account_num = req.body.accountNumber;

    if(!userId || !account_num) return res.status(400).json({'message': 'Account ID and num required'});
    
    const foundUser = await User.findOne({"_id": userId}).exec();

    if(!foundUser) return res.status(204).json({'message': 'No User found.'});

    if(foundUser.bank_accounts[account_num] === undefined) return res.status(204).json({'message': 'No bank_account found'});

    const accountNumber = foundUser.bank_accounts[account_num].account_number;
    const balance = foundUser.bank_accounts[account_num].balance;
    const limit = foundUser.bank_accounts[account_num].limit;
    const transactions = foundUser.bank_accounts[account_num].transactions;

    res.status(200).json({accountNumber, balance, limit, transactions});
}

const createNewCreditAccount = async (req, res) => {

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

    return res.status(200).json({'success': `New credit account ${foundUser.bank_accounts[1]} created.`});

}


module.exports = {
    createNewCreditAccount,
    getAllAccountTransactions
};