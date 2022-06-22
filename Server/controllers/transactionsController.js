const User = require('../models/User');

const transferHandler = async (req, res) => {
    const account1_id = req.body.account1_id;
    const account2_id = req.body.account2_id;

    const account1_account_num = req.body.account1_account_num;
    const account2_account_num = req.body.account2_account_num;

    const amount = req.body.amount;
    const transferMethod = req.body.method;

    if(!account1_id || !account2_id || !amount) return res.status(400).json({'message': 'Account numbers and amount required'});

    const foundUser1 = await User.findOne({_id: account1_id});
    const foundUser2 = await User.findOne({_id: account2_id});

    if(!foundUser1 || !foundUser2) return res.status(400).json({'message': 'No users found.'});

    const balance1 = foundUser1.bank_accounts[account1_account_num].balance;
    const balance2 = foundUser2.bank_accounts[account2_account_num].balance;

    const limit = foundUser1.bank_accounts[account1_account_num].limit;

    if(transferMethod === "transfer"){

        if(account1_account_num == 0 && balance1 < amount) return res.status(406).json({'message': 'User1 balance too low.'});

        if(account1_account_num == 1 && -limit > balance1-amount) return res.status(406).json({'message': 'User1 limit reached.'});

        foundUser1.bank_accounts[account1_account_num].balance = balance1 - amount;
        foundUser2.bank_accounts[account2_account_num].balance = balance2 + amount;

        //creating transactions for bankaccounts
        foundUser1.bank_accounts[account1_account_num].transactions.push({
            'from': foundUser1.bank_accounts[account1_account_num].account_number,
            'to': foundUser2.bank_accounts[account2_account_num].account_number,
            'amount': amount,
            'date': Date.now(),
            'transaction_name': 'Send'
        });

        foundUser2.bank_accounts[account2_account_num].transactions.push({
            'from': foundUser1.bank_accounts[account1_account_num].account_number,
            'to': foundUser2.bank_accounts[account2_account_num].account_number,
            'amount': amount,
            'date': Date.now(),
            'transaction_name': 'Receive'
        });

        const result1 = await foundUser1.save();
        const result2 = await foundUser2.save();
    }

    res.sendStatus(200);
}

module.exports = {transferHandler};